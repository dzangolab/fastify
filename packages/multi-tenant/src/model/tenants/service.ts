import { Service as BaseService } from "@dzangolab/fastify-slonik";

import SqlFactory from "./sqlFactory";
import getDatabaseConfig from "../../lib/getDatabaseConfig";
import getMultiTenantConfig from "../../lib/multiTenantConfig";
import runMigrations from "../../lib/runMigrations";

import type { Tenant, TenantCreateInput, TenantUpdateInput } from "../../types";
import type { ApiConfig } from "@dzangolab/fastify-config";
import type { Database } from "@dzangolab/fastify-slonik";
import type { QueryResultRow } from "slonik";

class Service<
  Tenant extends QueryResultRow,
  TenantCreateInput extends QueryResultRow,
  TenantUpdateInput extends QueryResultRow
> extends BaseService<Tenant, TenantCreateInput, TenantUpdateInput> {
  constructor(
    config: ApiConfig,
    database: Database,
    table: string,
    schema?: string
  ) {
    super(
      config,
      database,
      config?.multiTenant?.table?.name || "tenants",
      schema
    );
  }

  all = async (fields: string[]): Promise<readonly Tenant[]> => {
    const query = this.factory.getAllWithAliasesSql(fields);

    const tenants = await this.database.connect((connection) => {
      return connection.any(query);
    });

    return tenants;
  };

  create = async (data: TenantCreateInput): Promise<Tenant> => {
    /* [OP 2023-JAN-31] let the sqlFactory handle this. */
    if (!data[slugColumn]) {
      throw new Error(`${slugColumn} missing`);
    }

    if (await this.findOneBySlug(data[slugColumn])) {
      throw new Error(`${data[slugColumn]} ${slugColumn} already exists`);
    }

    const query = this.factory.getCreateSql(data);

    let tenant: Tenant;

    try {
      tenant = await this.database.connect(async (connection) => {
        return connection.query(query).then((data) => {
          return data.rows[0];
        });
      });
    } catch {
      throw new Error("Database connection error");
    }

    if (!tenant) {
      throw new Error("Unexpected error");
    }

    // run migration on created tenant
    /*
    await runMigrations(
      getDatabaseConfig(this.config.slonik),
      multiTenantConfig.migrations.path,
      tenant[slugColumn]
    );
    */

    return tenant;
  };

  findByHostname = async (hostName: string): Promise<Tenant | null> => {
    const query = this.factory.getFindByHostnameSql(
      hostName,
      this.config.multiTenant.rootDomain
    );

    const tenant = await this.database.connect(async (connection) => {
      return connection.maybeOne(query);
    });

    return tenant;
  };

  /**
   * @deprecated
   * @see findByHostname
   * [OP 2023-JAN-31]
   */
  /*
  findOneBySlug = async (slug: string): Promise<Tenant | null> => {
    const query = this.factory().getFindBySlugSql(slug);

    const tenant = await this.database.connect(async (connection) => {
      return connection.maybeOne(query);
    });

    return tenant;
  };
  */

  get factory(): SqlFactory<Tenant, TenantCreateInput, TenantUpdateInput> {
    if (!this._factory) {
      const factory = new SqlFactory<
        Tenant,
        TenantCreateInput,
        TenantUpdateInput
      >(this.table, this.schema);

      factory.initFieldMappings(this.config.multiTenant);

      this._factory = factory;
    }

    return this.factory;
  }
}

export default Service;
