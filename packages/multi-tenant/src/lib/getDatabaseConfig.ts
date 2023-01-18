import type { SlonikConfig } from "@dzangolab/fastify-slonik";
import type { MigrateDBConfig } from "@dzangolab/postgres-migrations";

const getDatabaseConfig = (slonikConfig: SlonikConfig): MigrateDBConfig => {
  return {
    database: slonikConfig.db.databaseName,
    user: slonikConfig.db.username,
    password: slonikConfig.db.password,
    host: slonikConfig.db.host,
    port: slonikConfig.db.port,
  } as MigrateDBConfig;
};

export default getDatabaseConfig;
