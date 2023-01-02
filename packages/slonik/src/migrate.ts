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

  const client = new pg.Client(dbConfig as pg.ClientConfig);
  await client.connect();

  const path = slonikConfig.migrations.path;

  await runMigrations({ client }, path);

  // [DU] fs.existsSync does not work when build
  // Instead looking for "tenants" under migrations migrations,
  // it looks of "tenants" table under default schema

  const db = await database(config);

  const tenantService = TenantService(config, db, sql);

  const tenants = await tenantService.all();

  for (const tenant of tenants.values()) {
    await runTenantMigrations(client, path + "/tenants", tenant);
  }

  await changeSchema(client, "public");
};

export default migrate;
