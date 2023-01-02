import type { ApiConfig } from "@dzangolab/fastify-config";
import type { MigrateDBConfig } from "postgres-migrations";
import type { SlonikConfig } from "../types";

const getMigrateDatabaseConfig = (config: ApiConfig) => {
  const slonikConfig = config.slonik as SlonikConfig;

  return {
    database: slonikConfig.db.databaseName,
    user: slonikConfig.db.username,
    password: slonikConfig.db.password,
    host: slonikConfig.db.host,
    port: slonikConfig.db.port,

    // Default: false for backwards-compatibility
    ensureDatabaseExists: true,

    // Default: "postgres"
    // Used when checking/creating "database-name"
    defaultDatabase: "postgres",
  } as MigrateDBConfig;
};

export default getMigrateDatabaseConfig;
