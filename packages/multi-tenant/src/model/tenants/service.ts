import { createTableFragment, SqlFactory } from "@dzangolab/fastify-slonik";

import getDatabaseConfig from "../../lib/getDatabaseConfig";
import getMultiTenantConfig from "../../lib/multiTenantConfig";
import runMigrations from "../../lib/runMigrations";

import type { Tenant, TenantInput } from "../../types";
import type { ApiConfig } from "@dzangolab/fastify-config";
import type { Database } from "@dzangolab/fastify-slonik";
import type { DatabasePoolConnection, SqlTaggedTemplate } from "slonik";

const TenantService = (
  config: ApiConfig,
  database: Database,
  sql: SqlTaggedTemplate
) => {
  const multiTenantConfig = getMultiTenantConfig(config);

  const tableName = multiTenantConfig.table.name;

  const { slug: slugColumn } = multiTenantConfig.table.columns;

  const columns = Object.values(multiTenantConfig.table.columns);

  const factory = SqlFactory<Tenant, TenantInput>(sql, tableName, config);

  const all = async (): Promise<readonly Tenant[]> => {
    const query = factory.all(columns);

    const tenants = await database.connect(
      (connection: DatabasePoolConnection) => {
        return connection.any(query);
      }
    );

    return tenants;
  };

  const create = async (tenantInput: TenantInput): Promise<Tenant> => {
    if (!tenantInput[slugColumn]) {
      throw new Error(`${slugColumn} missing`);
    }

    if (await findOneBySlug(tenantInput[slugColumn])) {
      throw new Error(
        `${tenantInput[slugColumn]} ${slugColumn} already exists`
      );
    }

    const query = factory.create(tenantInput);

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

  const findOneBySlug = async (slug: string): Promise<Tenant | null> => {
    const query = sql<Tenant>`
      SELECT *
      FROM ${createTableFragment(tableName)}
      WHERE ${sql.identifier([slugColumn])} = ${slug};
    `;

    const tenant = await database.connect(
      (connection: DatabasePoolConnection) => {
        return connection.maybeOne(query);
      }
    );

    return tenant;
  };

  return { all, create, findOneBySlug };
};

export default TenantService;
