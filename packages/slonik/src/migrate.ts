import { migrate as runMigrations } from "@dzangolab/postgres-migrations";

import type { SlonikConfig } from "./types";
import type { ApiConfig } from "@dzangolab/fastify-config";
import type { MigrateDBConfig } from "@dzangolab/postgres-migrations";

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

  const defaultMigrationsPath = "migrations";

  await runMigrations(
    dbConfig,
    slonikConfig?.migrations?.path || defaultMigrationsPath
  );
};

export default migrate;
