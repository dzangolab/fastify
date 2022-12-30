// import fs from "node:fs";

import { migrate as runMigrations } from "postgres-migrations";
import { sql } from "slonik";

import changeSchema from "./changeSchema";
import runTenantMigrations from "./runTenantMigrations";
import TenantService from "./tenantService";
import database from "./utils/database";
import getMigrateDBConfig from "./utils/getMigrateDatabaseConfig";

import type { SlonikConfig } from "./types";
import type { ApiConfig } from "@dzangolab/fastify-config";

const migrate = async (config: ApiConfig) => {
  const slonikConfig = config.slonik as SlonikConfig;

  const dbConfig = getMigrateDBConfig(config);

  const path = slonikConfig.migrations.path;

  await runMigrations(dbConfig, path);

  // if (fs.existsSync(path + "/tenants")) {
  const tenantService = TenantService(config, await database(config), sql);

  const tenants = await tenantService.all();

  for (const tenant of tenants.values()) {
    await runTenantMigrations(config, path, tenant);
  }

  await changeSchema("public", config);
  // }
};

export default migrate;
