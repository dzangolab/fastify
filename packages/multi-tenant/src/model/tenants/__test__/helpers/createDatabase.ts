/* istanbul ignore file */
import { createMockPool, createMockQueryResult } from "slonik";

const helper = (result = [{}]) => {
  const pool = createMockPool({
    query: async () => {
      return createMockQueryResult(result);
    },
  });

  return {
    connect: pool.connect.bind(pool),
    pool,
    query: pool.query.bind(pool),
  };
};

export default helper;
