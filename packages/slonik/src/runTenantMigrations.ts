import { ApiConfig } from "@dzangolab/fastify-config";
import { migrate as runMigrations } from "postgres-migrations";

import changeSchema from "./changeSchema";
import getMigrateDatabaseConfig from "./utils/getMigrateDatabaseConfig";

import type { TenantInput } from "./types";

const runTenantMigrations = async (
  config: ApiConfig,
  path: string,
  tenant: TenantInput
) => {
  await changeSchema(tenant.slug, config);

  const dbConfig = getMigrateDatabaseConfig(config);

  await runMigrations(dbConfig, path);
};

export default runTenantMigrations;
