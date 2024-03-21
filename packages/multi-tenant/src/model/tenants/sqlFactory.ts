import {
  DefaultSqlFactory,
  createLimitFragment,
  createSortFragment,
  createTableIdentifier,
  createWhereFragment,
} from "@dzangolab/fastify-slonik";
import humps from "humps";
import { sql } from "slonik";
import { z } from "zod";

import type { Service } from "../../types/tenantService";
import type { FilterInput, SortInput } from "@dzangolab/fastify-slonik";
import type { QueryResultRow, QuerySqlToken } from "slonik";

/* eslint-disable brace-style */
class TenantSqlFactory<
  Tenant extends QueryResultRow,
  TenantCreateInput extends QueryResultRow,
  TenantUpdateInput extends QueryResultRow
> extends DefaultSqlFactory<Tenant, TenantCreateInput, TenantUpdateInput> {
  /* eslint-enabled */
  protected fieldMappings = new Map(
    Object.entries({
      domain: "domain",
      id: "id",
      name: "name",
      ownerId: "owner_id",
      slug: "slug",
    })
  );

  constructor(service: Service<Tenant, TenantCreateInput, TenantUpdateInput>) {
    super(service);

    this.init();
  }

  getAllWithAliasesSql = (fields: string[]): QuerySqlToken => {
    const identifiers = [];

    for (const field of fields) {
      if (field != "host") {
        identifiers.push(sql.fragment`${this.getAliasedField(field)}`);
      }
    }

    const tableIdentifier = createTableIdentifier(this.table, this.schema);

    const domainIdentifier = sql.identifier([this.getMappedField("domain")]);
    const slugIdentifier = sql.identifier([this.getMappedField("slug")]);
    const rootDomain = this.config.multiTenant.rootDomain;

    const hostFragment = fields.includes("host")
      ? sql.fragment`,
          CASE
            WHEN ${domainIdentifier} IS NOT NULL THEN ${domainIdentifier}
            ELSE CONCAT(${slugIdentifier}, ${"." + rootDomain}::TEXT)
          END AS host
        `
      : sql.fragment``;

    return sql.type(z.any())`
      SELECT ${sql.join(identifiers, sql.fragment`, `)}
        ${hostFragment}
      FROM ${this.getTableFragment()}
      ${createWhereFragment(this.filterWithOwnerId(), tableIdentifier)}
      ORDER BY ${sql.identifier([
        humps.decamelize(this.getMappedField("id")),
      ])} ASC;
    `;
  };

  getCountSql = (filters?: FilterInput): QuerySqlToken => {
    const tableIdentifier = createTableIdentifier(this.table, this.schema);

    const countSchema = z.object({
      count: z.number(),
    });

    return sql.type(countSchema)`
      SELECT COUNT(*)
      FROM ${this.getTableFragment()}
      ${createWhereFragment(this.filterWithOwnerId(filters), tableIdentifier)};
    `;
  };

  getCreateSql = (data: TenantCreateInput): QuerySqlToken => {
    const identifiers = [];
    const values = [];

    for (const column in data) {
      const key = column as keyof TenantCreateInput;
      const value = data[key];
      identifiers.push(
        sql.identifier([humps.decamelize(this.getMappedField(key as string))])
      );
      values.push(value);
    }

    return sql.type(z.any())`
      INSERT INTO ${this.getTableFragment()}
        (${sql.join(identifiers, sql.fragment`, `)})
      VALUES (${sql.join(values, sql.fragment`, `)})
      RETURNING *;
    `;
  };

  getFindByHostnameSql = (
    hostname: string,
    rootDomain: string
  ): QuerySqlToken => {
    const query = sql.type(z.any())`
      SELECT *
      FROM ${this.getTableFragment()}
      WHERE ${sql.identifier([
        humps.decamelize(this.getMappedField("domain")),
      ])} = ${hostname}
      OR (
        ${sql.identifier([humps.decamelize(this.getMappedField("slug"))])}
        || '.' ||
        ${rootDomain}
      ) = ${hostname};
    `;

    return query;
  };

  getFindByIdSql = (id: number | string): QuerySqlToken => {
    const filters = {
      key: this.getMappedField("id"),
      operator: "eq",
      value: id,
    } as FilterInput;

    const tableIdentifier = createTableIdentifier(this.table, this.schema);

    return sql.type(this.validationSchema)`
      SELECT *
      FROM ${this.getTableFragment()}
      ${createWhereFragment(this.filterWithOwnerId(filters), tableIdentifier)}
    `;
  };

  getFindBySlugOrDomainSql = (slug: string, domain?: string): QuerySqlToken => {
    const domainIdentifier = sql.identifier([this.getMappedField("domain")]);
    const slugIdentifier = sql.identifier([this.getMappedField("slug")]);

    const domainFilterFragment = domain
      ? sql.fragment`
        OR ${domainIdentifier} = ${domain}
      `
      : sql.fragment``;

    return sql.type(this.validationSchema)`
      SELECT *
      FROM ${this.getTableFragment()}
      WHERE
      ${slugIdentifier} = ${slug}
      ${domainFilterFragment};
    `;
  };

  getListSql = (
    limit: number,
    offset?: number,
    filters?: FilterInput,
    sort?: SortInput[]
  ): QuerySqlToken => {
    const tableIdentifier = createTableIdentifier(this.table, this.schema);

    return sql.type(this.validationSchema)`
      SELECT *
      FROM ${this.getTableFragment()}
      ${createWhereFragment(this.filterWithOwnerId(filters), tableIdentifier)}
      ${createSortFragment(tableIdentifier, this.getSortInput(sort))}
      ${createLimitFragment(limit, offset)};
    `;
  };

  protected getAliasedField = (field: string) => {
    const mapped = this.getMappedField(field);

    return mapped === field
      ? sql.identifier([humps.decamelize(field)])
      : sql.join(
          [sql.identifier([humps.decamelize(mapped)]), sql.identifier([field])],
          sql.fragment` AS `
        );
  };

  protected getMappedField = (field: string): string => {
    return (
      this.fieldMappings.has(field) ? this.fieldMappings.get(field) : field
    ) as string;
  };

  protected init() {
    const columns = this.config.multiTenant?.table?.columns;

    if (columns) {
      for (const column in columns) {
        const key = column as keyof typeof columns;

        this.fieldMappings.set(key as string, columns[key] as string);
      }
    }
  }

  protected filterWithOwnerId(filters?: FilterInput) {
    if (this.ownerId) {
      const ownerFilter = {
        key: this.getMappedField("ownerId"),
        operator: "eq",
        value: this.ownerId,
      } as FilterInput;

      return filters
        ? ({ AND: [ownerFilter, filters] } as FilterInput)
        : ownerFilter;
    }

    return filters;
  }

  get ownerId() {
    return (
      this.service as Service<Tenant, TenantCreateInput, TenantUpdateInput>
    ).ownerId;
  }
}

export default TenantSqlFactory;
