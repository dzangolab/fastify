import { sql } from "slonik";

import TenantService from "./model/tenants/service";
import runMigrations from "./runMigrations";
import database from "./utils/database";

import type { SlonikConfig } from "./types";
import type { ApiConfig } from "@dzangolab/fastify-config";

const migrate = async (config: ApiConfig) => {
  const slonikConfig = config.slonik as SlonikConfig;

  const path = slonikConfig.migrations.path;

  await runMigrations(config, path);

  // [DU] fs.existsSync does not work when build
  // Instead of looking for "tenants" under migrations migrations,
  // it looks of "tenants" table under default schema

  const db = await database(config);

  const tenantService = TenantService(config, db, sql);

  const tenants = await tenantService.all();

  for (const tenant of tenants.values()) {
    await runMigrations(config, path + "/tenants", tenant.slug);
  }
};

export default migrate;
