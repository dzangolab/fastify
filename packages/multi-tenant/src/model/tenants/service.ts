import { SqlFactory } from "@dzangolab/fastify-slonik";

import type { Tenant, TenantInput } from "../../types";
import type { ApiConfig } from "@dzangolab/fastify-config";
import type { Database } from "@dzangolab/fastify-slonik";
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
  };
};

export default TenantService;

export { tableName };
