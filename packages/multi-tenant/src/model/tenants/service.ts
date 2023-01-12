import { SqlFactory } from "@dzangolab/fastify-slonik";

import getMultiTenantConfig from "../../multiTenantConfig";

import type { Tenant, TenantInput } from "../../types";
import type { ApiConfig } from "@dzangolab/fastify-config";
import type { Database } from "@dzangolab/fastify-slonik";
import type { SqlTaggedTemplate } from "slonik";

const TenantService = (
  config: ApiConfig,
  database: Database,
  sql: SqlTaggedTemplate
) => {
  const multiTenantConfig = getMultiTenantConfig(config);

  const tableName = multiTenantConfig.table.name;

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
  };
};

export default TenantService;
