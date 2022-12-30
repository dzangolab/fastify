// import fs from "node:fs";

import * as pg from "pg";
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

  const client = new pg.Client(dbConfig as pg.ClientConfig);
  await client.connect();

  await runMigrations({ client }, path);

  // if (fs.existsSync(path + "/tenants")) {
  const db = await database(config);
  const tenantService = TenantService(config, db, sql);

  const tenants = await tenantService.all();

  for (const tenant of tenants.values()) {
    await runTenantMigrations(client, path + "/tenants", tenant);
  }

  await changeSchema(client, "public");
  // }
};

export default migrate;
