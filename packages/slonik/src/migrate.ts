import { migrate as runMigrations } from "@dzangolab/postgres-migrations";

import runCustomMigrations from "./migrations/runCustomMigrations";

import type { SlonikConfig } from "./types";
import type { MigrateDBConfig } from "@dzangolab/postgres-migrations";
import type { FastifyInstance } from "fastify";

const migrate = async (fastify: FastifyInstance) => {
  await runCustomMigrations(fastify);

  const slonikConfig = fastify.config.slonik as SlonikConfig;

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
