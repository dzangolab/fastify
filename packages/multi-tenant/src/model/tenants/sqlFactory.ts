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
  protected fieldMappings = new Map();

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

  getFindBySlugSql = (slug: string) => {
    const query = sql<Tenant>`
      SELECT *
      FROM ${this.getTableFragment()}
      WHERE ${sql.identifier([
        humps.decamelize(this.getMappedField("slug")),
      ])} = ${slug};
    `;

    return query;
  };

  initFieldMappings = (config?: MultiTenantConfig) => {
    const fields = {
      domain: "domain",
      id: "id",
      name: "name",
      slug: "slug",
      ...config?.table?.columns,
    };

    for (const field in fields) {
      const key = field as keyof typeof fields;

      this.fieldMappings.set(key, fields[key]);
    }
  };

  protected getAliasedField = (field: string) => {
    const mapped = this.getMappedField(field);

    const raw = mapped === field ? field : `${mapped} AS ${field}`;

    return sql.identifier([raw]);
  };

  protected getMappedField = (field: string) => {
    return this.fieldMappings.has(field)
      ? this.fieldMappings.get(field)
      : field;
  };
}

export default SqlFactory;
