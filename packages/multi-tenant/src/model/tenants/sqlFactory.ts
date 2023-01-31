import { SqlFactory as BaseSqlFactory } from "@dzangolab/fastify-slonik";
import humps from "humps";
import { sql } from "slonik";

import type { MultiTenantConfig } from "../../types";
import type { QueryResultRow } from "slonik";

class SqlFactory<
  Tenant extends QueryResultRow,
  TenantCreateInput extends QueryResultRow,
  TenantUpdateInput extends QueryResultRow
> extends BaseSqlFactory<Tenant, TenantCreateInput, TenantUpdateInput> {
  protected fieldMappings = new Map(
    Object.entries({
      domain: "domain",
      id: "id",
      name: "name",
      slug: "slug",
    })
  );

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

  initFieldMappings = (config?: MultiTenantConfig) => {
    const columns = config?.table?.columns;

    if (columns) {
      for (const column in columns) {
        const key = column as keyof typeof columns;

        this.fieldMappings.set(key, columns[key] as string);
      }
    }
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
}

export default SqlFactory;
