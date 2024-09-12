/* istanbul ignore file */
import { newDb } from "pg-mem";

import type { SlonikAdapterOptions, IMemoryDb } from "pg-mem";

interface IOptions {
  db?: IMemoryDb;
  slonikAdapterOptions?: SlonikAdapterOptions;
}

const helper = async (options?: IOptions) => {
  const db = options?.db ?? newDb();

  const pool = await db.adapters.createSlonik(
    options?.slonikAdapterOptions ?? {},
  );

  return {
    connect: pool.connect.bind(pool),
    pool,
    query: pool.query.bind(pool),
  };
};

export default helper;
