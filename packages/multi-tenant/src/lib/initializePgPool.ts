import * as pg from "pg";

import type { ClientConfig } from "pg";

const initializePgPool = async (databaseConfig: ClientConfig) => {
  const client = new pg.Client(databaseConfig);

  await client.connect();

  return client;
};

export default initializePgPool;
