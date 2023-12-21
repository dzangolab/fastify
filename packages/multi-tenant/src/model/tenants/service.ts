import { BaseService } from "@dzangolab/fastify-slonik";

import getMultiTenantConfig from "./../../lib/getMultiTenantConfig";
import SqlFactory from "./sqlFactory";
import getDatabaseConfig from "../../lib/getDatabaseConfig";
import runMigrations from "../../lib/runMigrations";

import type { Tenant as BaseTenant } from "../../types";
import type { Service } from "@dzangolab/fastify-slonik";
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
  all = async (fields: string[]): Promise<readonly Tenant[]> => {
    const query = this.factory.getAllWithAliasesSql(fields);

    const tenants = await this.database.connect((connection) => {
      return connection.any(query);
    });

    return tenants as Tenant[];
  };

  create = async (data: TenantCreateInput): Promise<Tenant | undefined> => {
    const query = this.factory.getCreateSql(data);

    const result = (await this.database.connect(async (connection) => {
      return connection.query(query).then((data) => {
        return data.rows[0];
      });
    })) as Tenant;

    return result ? this.postCreate(result) : undefined;
  };

  findByHostname = async (hostname: string): Promise<Tenant | null> => {
    const query = this.factory.getFindByHostnameSql(
      hostname,
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

  get sortKey(): string {
    return this.config.multiTenant.table?.columns?.id || super.sortKey;
  }

  get table() {
    return this.config.multiTenant?.table?.name || "tenants";
  }

  protected postCreate = async (tenant: Tenant): Promise<Tenant> => {
    const multiTenantConfig = getMultiTenantConfig(this.config);

    await runMigrations(
      getDatabaseConfig(this.config.slonik),
      multiTenantConfig.migrations.path,
      tenant as BaseTenant
    );

    return tenant;
  };
}

export default TenantService;
