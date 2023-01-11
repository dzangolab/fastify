import * as pg from "pg";
import { MigrateDBConfig } from "postgres-migrations";

const createPgPool = async (migrateDatabaseConfig: MigrateDBConfig) => {
  const client = new pg.Client(migrateDatabaseConfig as pg.ClientConfig);
  await client.connect();

  return client;
};

export default createPgPool;
