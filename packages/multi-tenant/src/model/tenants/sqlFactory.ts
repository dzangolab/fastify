import {
  DefaultSqlFactory,
  createFilterFragment,
  createLimitFragment,
  createSortFragment,
  createTableIdentifier,
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
      identifiers.push(sql.fragment`${this.getAliasedField(field)}`);
    }

    return sql.type(z.any())`
      SELECT ${sql.join(identifiers, sql.fragment`, `)}
      FROM ${this.getTableFragment()}
      ORDER BY ${sql.identifier([
        humps.decamelize(this.getMappedField("id")),
      ])} ASC;
    `;
  };

  getCountSql = (filters?: FilterInput): QuerySqlToken => {
    const tableIdentifier = createTableIdentifier(this.table, this.schema);

    if (this.ownerFilter) {
      filters = filters
        ? ({ AND: [this.ownerFilter, filters] } as FilterInput)
        : this.ownerFilter;
    }

    const countSchema = z.object({
      count: z.number(),
    });

    return sql.type(countSchema)`
      SELECT COUNT(*)
      FROM ${this.getTableFragment()}
      ${createFilterFragment(filters, tableIdentifier)};
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
    let filters = {
      key: this.getMappedField("id"),
      operator: "eq",
      value: id,
    } as FilterInput;

    if (this.ownerFilter) {
      filters = { AND: [this.ownerFilter, filters] } as FilterInput;
    }

    const tableIdentifier = createTableIdentifier(this.table, this.schema);

    return sql.type(this.validationSchema)`
      SELECT *
      FROM ${this.getTableFragment()}
      ${createFilterFragment(filters, tableIdentifier)}
    `;
  };

  getListSql = (
    limit: number,
    offset?: number,
    filters?: FilterInput,
    sort?: SortInput[]
  ): QuerySqlToken => {
    const tableIdentifier = createTableIdentifier(this.table, this.schema);

    if (this.ownerFilter) {
      filters = filters
        ? ({ AND: [this.ownerFilter, filters] } as FilterInput)
        : this.ownerFilter;
    }

    return sql.type(this.validationSchema)`
      SELECT *
      FROM ${this.getTableFragment()}
      ${createFilterFragment(filters, tableIdentifier)}
      ${createSortFragment(tableIdentifier, this.getSortInput(sort))}
      ${createLimitFragment(limit, offset)};
    `;
  };

  protected getAliasedField = (field: string) => {
    const mapped = this.getMappedField(field);

    return mapped === field
      ? sql.identifier([field])
      : sql.join(
          [sql.identifier([mapped]), sql.identifier([field])],
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

  get ownerFilter() {
    return this.ownerId
      ? ({
          key: this.getMappedField("ownerId"),
          operator: "eq",
          value: this.ownerId,
        } as FilterInput)
      : undefined;
  }

  get ownerId() {
    return (
      this.service as Service<Tenant, TenantCreateInput, TenantUpdateInput>
    ).ownerId;
  }
}

export default TenantSqlFactory;
