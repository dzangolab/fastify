import { SqlFactory as BaseSqlFactory } from "@dzangolab/fastify-slonik";
import humps from "humps";
import { sql } from "slonik";

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import type { MultiTenantEnabledConfig } from "../../types";
import type { SlonikEnabledConfig } from "@dzangolab/fastify-slonik";
import type { QueryResultRow } from "slonik";

class SqlFactory<
  MultiTenantEnabledConfig extends SlonikEnabledConfig,
  Tenant extends QueryResultRow,
  TenantCreateInput extends QueryResultRow,
  TenantUpdateInput extends QueryResultRow
> extends BaseSqlFactory<
  MultiTenantEnabledConfig,
  Tenant,
  TenantCreateInput,
  TenantUpdateInput
> {
  protected fieldMappings = new Map();

  constructor(
    config: MultiTenantEnabledConfig,
    table: string,
    schema?: string
  ) {
    super(config, table, schema);

    // FIXME [OP 2023-JAN-29] Remove hard-coded default table name
    this.table = config?.multiTenant?.table?.name || "tenants";

    this.initFieldMappings();
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

  protected initFieldMappings = () => {
    const fields = {
      domain: "domain",
      id: "id",
      name: "name",
      slug: "slug",
      ...this.config?.multiTenant?.table?.columns,
    };

    for (const field in fields) {
      const key = field as keyof typeof fields;

      this.fieldMappings.set(key, fields[key]);
    }
  };
}

export default SqlFactory;
