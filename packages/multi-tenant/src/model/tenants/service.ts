import { createTableFragment, SqlFactory } from "@dzangolab/fastify-slonik";

import getDatabaseConfig from "../../lib/getDatabaseConfig";
import getMultiTenantConfig from "../../lib/multiTenantConfig";

import type { Tenant, TenantInput } from "../../types";

import runMigrations from "../../lib/runMigrations";

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

  return {
    all: async (): Promise<readonly Tenant[]> => {
      const query = factory.all(columns);

      const result = await database.connect((connection) => {
        return connection.any(query);
      });

      return result;
    },
    create: async (tenantInput: TenantInput): Promise<Tenant> => {
      const query = factory.create(tenantInput);

      const result = await database.connect(
        async (connection: DatabasePoolConnection) => {
          return connection.query(query).then((data) => {
            return data.rows[0];
          });
        }
      );

      // run migration on created tenant
      await runMigrations(
        getDatabaseConfig(config.slonik),
        `${config.slonik.migrations.path}/${multiTenantConfig.migrations.directory}`,
        tenantInput.slug
      );

      return result;
    },
    findOneBySlug: async (slug: string): Promise<Tenant | null> => {
      const query = sql<Tenant>`
        SELECT *
        FROM ${createTableFragment(tableName)}
        WHERE ${sql.identifier([slugColumn])} = ${slug};
      `;

      const result = await database.connect((connection) => {
        return connection.one(query);
      });

      return result;
    },
  };
};

export default TenantService;
