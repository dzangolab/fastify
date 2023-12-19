import { DefaultSqlFactory } from "@dzangolab/fastify-slonik";
import humps from "humps";
import { sql } from "slonik";
import { z } from "zod";

import type { Service } from "@dzangolab/fastify-slonik";
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
    return sql.type(this.validationSchema)`
      SELECT *
      FROM ${this.getTableFragment()}
      WHERE ${sql.identifier([this.sortKey])} = ${id};
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
}

export default TenantSqlFactory;
