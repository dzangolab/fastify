import { createPool, stringifyDsn } from "slonik";

import type { Database } from "../types";
import type { ApiConfig } from "@dzangolab/fastify-config";
import type { DatabasePool } from "slonik";

const database = async (config: ApiConfig): Promise<Database> => {
  const pool: DatabasePool = await createPool(stringifyDsn(config.slonik.db));

  const database: Database = {
    connect: pool.connect.bind(pool),
    pool,
    query: pool.query.bind(pool),
  };

  return database;
};

export default database;
