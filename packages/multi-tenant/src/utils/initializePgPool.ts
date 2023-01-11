import * as pg from "pg";
import { MigrateDBConfig } from "postgres-migrations";

const initializePgPool = async (databaseConfig: MigrateDBConfig) => {
  const client = new pg.Client(databaseConfig as pg.ClientConfig);

  await client.connect();

  return client;
};

export default initializePgPool;
