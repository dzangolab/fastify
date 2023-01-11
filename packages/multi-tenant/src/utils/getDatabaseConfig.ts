import type { SlonikConfig } from "@dzangolab/fastify-slonik";
import type { MigrateDBConfig } from "postgres-migrations";

const getDatabaseConfig = (slonikConfig: SlonikConfig) => {
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

export default getDatabaseConfig;
