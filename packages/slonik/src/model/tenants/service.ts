import { ApiConfig } from "@dzangolab/fastify-config";

import runMigrations from "../../runMigrations";
import SqlFactory from "../../sqlFactory";
import getMigrateDatabaseConfig from "../../utils/getMigrateDatabaseConfig";

import type { Database, Tenant, TenantInput } from "../../types";
import type { SqlTaggedTemplate } from "slonik";

const tableName = "tenants";

const TenantService = (
  config: ApiConfig,
  database: Database,
  sql: SqlTaggedTemplate
) => {
  const factory = SqlFactory<Tenant, TenantInput>(sql, tableName, config);

  return {
    all: async (): Promise<readonly Tenant[]> => {
      const query = factory.all(["id", "name", "slug"]);

      const result = await database.connect((connection) => {
        return connection.any(query);
      });

      return result;
    },

    create: async (data: TenantInput): Promise<Tenant> => {
      const query = factory.create(data);

      const result = await database.connect(async (connection) => {
        return connection.query(query).then((data) => {
          return data.rows[0];
        });
      });

      // Run migrations on created tenant.
      await runMigrations(
        getMigrateDatabaseConfig(config.slonik),
        config.slonik.migrations + "/tenants",
        result.slug
      );

      return result;
    },

    delete: async (id: number): Promise<Tenant | null> => {
      const query = factory.delete(id);

      const result = await database.connect((connection) => {
        return connection.one(query);
      });

      // Delete the schema
      const deleteQuery = sql`DROP SCHEMA IF EXISTS ${result.slug} CASCADE`;

      await database.connect((connection) => {
        return connection.query(deleteQuery);
      });

      return result;
    },

    findById: async (id: number): Promise<Tenant | null> => {
      const query = factory.findById(id);

      const result = await database.connect((connection) => {
        return connection.maybeOne(query);
      });

      return result;
    },

    update: async (id: number, data: TenantInput): Promise<Tenant> => {
      const query = factory.update(id, data);

      return await database.connect((connection) => {
        return connection.query(query).then((data) => {
          return data.rows[0];
        });
      });
    },
  };
};

export default TenantService;

export { tableName };
