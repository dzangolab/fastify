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

  // Look for folder "tenents" inside the given migraton folder

  // If "tenents" folder exists, then it is multi-tenant
  // Do multi-tenant migration according

  // Else do normal migrations
  console.log(dbConfig, slonikConfig.migrations.path);
  await runMigrations(dbConfig, slonikConfig.migrations.path);
};

export default migrate;
