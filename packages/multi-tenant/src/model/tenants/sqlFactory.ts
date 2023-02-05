import { DefaultSqlFactory } from "@dzangolab/fastify-slonik";
import humps from "humps";
import { sql } from "slonik";

import type { Service, SqlFactory } from "@dzangolab/fastify-slonik";
import type { QueryResultRow } from "slonik";

/* eslint-disable brace-style */
class TenantSqlFactory<
    Tenant extends QueryResultRow,
    TenantCreateInput extends QueryResultRow,
    TenantUpdateInput extends QueryResultRow
  >
  extends DefaultSqlFactory<Tenant, TenantCreateInput, TenantUpdateInput>
  implements SqlFactory<Tenant, TenantCreateInput, TenantUpdateInput>
{
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

  getAllWithAliasesSql = (fields: string[]) => {
    const identifiers = [];

    for (const field of fields) {
      identifiers.push(sql`${this.getAliasedField(field)}`);
    }

    return sql<Tenant>`
      SELECT ${sql.join(identifiers, sql`, `)}
      FROM ${this.getTableFragment()}
      ORDER BY id ASC
    `;
  };

  getCreateSql = (data: TenantCreateInput) => {
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

    return sql<Tenant>`
      INSERT INTO ${this.getTableFragment()}
        (${sql.join(identifiers, sql`, `)})
      VALUES (${sql.join(values, sql`, `)})
      RETURNING *;
    `;
  };

  getFindByHostnameSql = (hostname: string, rootDomain: string) => {
    const query = sql<Tenant>`
      SELECT *
      FROM ${this.getTableFragment()}
      WHERE ${sql.identifier([
        humps.decamelize(this.getMappedField("domain")),
      ])} = ${hostname}
      OR CONCAT(
        ${sql.identifier([humps.decamelize(this.getMappedField("slug"))])},
        '.',
        ${sql.identifier([rootDomain])}
      ) = ${hostname};
    `;

    return query;
  };

  protected getAliasedField = (field: string) => {
    const mapped = this.getMappedField(field);

    const raw = mapped === field ? field : `${mapped} AS ${field}`;

    return sql.identifier([raw]);
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
