import SqlFactory from "./sqlFactory";
import getDatabaseConfig from "../../lib/getDatabaseConfig";
import getMultiTenantConfig from "../../lib/multiTenantConfig";
import runMigrations from "../../lib/runMigrations";

import type {
  MultiTenantEnabledConfig,
  Tenant,
  TenantCreateInput,
  TenantUpdateInput,
} from "../../types";
import type { Database } from "@dzangolab/fastify-slonik";
import type { DatabasePoolConnection } from "slonik";

const TenantService = (
  config: MultiTenantEnabledConfig,
  database: Database
) => {
  const multiTenantConfig = getMultiTenantConfig(config);

  const tableName = multiTenantConfig.table.name;

  const { slug: slugColumn } = multiTenantConfig.table.columns;

  const factory = new SqlFactory<
    MultiTenantEnabledConfig,
    Tenant,
    TenantCreateInput,
    TenantUpdateInput
  >(config, tableName);

  const all = async (fields: string[]): Promise<readonly Tenant[]> => {
    const query = factory.getAllWithAliasesSql(fields);

    const tenants = await database.connect(
      (connection: DatabasePoolConnection) => {
        return connection.any(query);
      }
    );

    return tenants;
  };

  const create = async (data: TenantCreateInput): Promise<Tenant> => {
    if (!data[slugColumn]) {
      throw new Error(`${slugColumn} missing`);
    }

    if (await findOneBySlug(data[slugColumn])) {
      throw new Error(`${data[slugColumn]} ${slugColumn} already exists`);
    }

    const query = factory.getCreateSql(data);

    let tenant: Tenant;

    try {
      tenant = await database.connect(
        async (connection: DatabasePoolConnection) => {
          return connection.query(query).then((data) => {
            return data.rows[0];
          });
        }
      );
    } catch {
      throw new Error("Database connection error");
    }

    if (!tenant) {
      throw new Error("Unexpected error");
    }

    // run migration on created tenant
    await runMigrations(
      getDatabaseConfig(config.slonik),
      multiTenantConfig.migrations.path,
      tenant[slugColumn]
    );

    return tenant;
  };

  const findByHostname = async (hostName: string): Promise<Tenant | null> => {
    const query = factory.getFindByHostnameSql(
      hostName,
      config.multiTenant.rootDomain
    );

    const tenant = await database.connect(
      async (connection: DatabasePoolConnection) => {
        return connection.maybeOne(query);
      }
    );

    return tenant;
  };

  const findOneBySlug = async (slug: string): Promise<Tenant | null> => {
    const query = factory.getFindBySlugSql(slug);

    const tenant = await database.connect(
      async (connection: DatabasePoolConnection) => {
        return connection.maybeOne(query);
      }
    );

    return tenant;
  };

  return { all, create, findByHostname, findOneBySlug };
};

export default TenantService;
