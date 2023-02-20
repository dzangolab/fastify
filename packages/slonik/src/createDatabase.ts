import { createPool } from "slonik";

import createClientConfiguration from "./factories/createClientConfiguration";

import type { Database } from "./types";
import type { ClientConfiguration, DatabasePool } from "slonik";

const createDatabase = async (
  connectionString: string,
  clientConfiguration?: Partial<ClientConfiguration>
): Promise<Database> => {
  const pool: DatabasePool = await createPool(
    connectionString,
    createClientConfiguration(clientConfiguration)
  );

  const database: Database = {
    connect: pool.connect.bind(pool),
    pool,
    query: pool.query.bind(pool),
  };

  return database;
};

export default createDatabase;
