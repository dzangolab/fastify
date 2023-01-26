import { MigrateDBConfig } from "@dzangolab/postgres-migrations";
import * as pg from "pg";

const initializePgPool = async (databaseConfig: MigrateDBConfig) => {
  const client = new pg.Client(databaseConfig as pg.ClientConfig);

  await client.connect();

  return client;
};

export default initializePgPool;
