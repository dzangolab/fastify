import type { SlonikConfig } from "../types";
import type { MigrateDBConfig } from "postgres-migrations";

const getMigrateDatabaseConfig = (slonikConfig: SlonikConfig) => {
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
