import { BaseService } from "@dzangolab/fastify-slonik";

import SqlFactory from "./sqlFactory";
import getDatabaseConfig from "../../lib/getDatabaseConfig";
import getMultiTenantConfig from "../../lib/multiTenantConfig";
import runMigrations from "../../lib/runMigrations";

import type { ApiConfig } from "@dzangolab/fastify-config";
import type { Database, Service } from "@dzangolab/fastify-slonik";
import type { QueryResultRow } from "slonik";

/* eslint-disable brace-style */
class TenantService<
    Tenant extends QueryResultRow,
    TenantCreateInput extends QueryResultRow,
    TenantUpdateInput extends QueryResultRow
  >
  extends BaseService<Tenant, TenantCreateInput, TenantUpdateInput>
  implements Service<Tenant, TenantCreateInput, TenantUpdateInput>
{
  /* eslint-enabled */
  constructor(config: ApiConfig, database: Database, schema?: string) {
    super(config, database, "public");
  }

  all = async (fields: string[]): Promise<readonly Tenant[]> => {
    const query = this.factory.getAllWithAliasesSql(fields);

    const tenants = await this.database.connect((connection) => {
      return connection.any(query);
    });

    return tenants as Tenant[];
  };

  findByHostname = async (slug: string): Promise<Tenant | null> => {
    const query = this.factory.getFindByHostnameSql(
      slug,
      this.config.multiTenant.rootDomain
    );

    const tenant = await this.database.connect(async (connection) => {
      return connection.maybeOne(query);
    });

    return tenant;
  };

  get factory() {
    if (!this.table) {
      throw new Error(`Service table is not defined`);
    }

    if (!this._factory) {
      this._factory = new SqlFactory<
        Tenant,
        TenantCreateInput,
        TenantUpdateInput
      >(this);
    }

    return this._factory as SqlFactory<
      Tenant,
      TenantCreateInput,
      TenantUpdateInput
    >;
  }

  get table() {
    return this.config.multiTenant?.table?.name || "tenants";
  }

  protected postCreate = async (tenant: Tenant): Promise<Tenant> => {
    const multiTenantConfig = getMultiTenantConfig(this.config);

    await runMigrations(
      getDatabaseConfig(this.config.slonik),
      multiTenantConfig.migrations.path,
      tenant.slug as string
    );

    return tenant;
  };
}

export default TenantService;
