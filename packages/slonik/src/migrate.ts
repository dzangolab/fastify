import path from "node:path";

import { migrate as runMigrations } from "postgres-migrations";

import type { SlonikConfig } from "./types";
import type { ApiConfig } from "@dzangolab/fastify-config";
import type { MigrateDBConfig } from "postgres-migrations";

const migrate = async (config: ApiConfig) => {
  const slonikConfig = config.slonik as SlonikConfig;

  const dbConfig = {
    database: slonikConfig.db.databaseName,
    user: slonikConfig.db.username,
    password: slonikConfig.db.password,
    host: slonikConfig.db.host,
    port: slonikConfig.db.port,

    // Default: false for backwards-compatibility
    // This might change!
    ensureDatabaseExists: true,

    // Default: "postgres"
    // Used when checking/creating "database-name"
    defaultDatabase: "postgres",
  } as MigrateDBConfig;

  let migrationsPath = slonikConfig.migrations.development;

  if (config.env === "production") {
    migrationsPath = slonikConfig.migrations.production;
  }

  await runMigrations(dbConfig, migrationsPath);
};

export default migrate;
