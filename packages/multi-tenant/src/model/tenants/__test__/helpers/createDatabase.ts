/* istanbul ignore file */
import { createMockPool, createMockQueryResult } from "slonik";

const helper = (databaseResponse = [{}]) => {
  const pool = createMockPool({
    query: async () => {
      return createMockQueryResult(databaseResponse);
    },
  });

  return {
    connect: pool.connect.bind(pool),
    pool,
    query: pool.query.bind(pool),
  };
};

export default helper;
