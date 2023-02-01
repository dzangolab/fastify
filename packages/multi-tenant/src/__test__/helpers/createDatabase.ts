/* istanbul ignore file */
import { createMockPool, createMockQueryResult } from "slonik";

const helper = (response: any) => {
  const pool = createMockPool({
    query: async () => {
      return createMockQueryResult(response);
    },
  });

  return {
    connect: pool.connect.bind(pool),
    pool,
    query: pool.query.bind(pool),
  };
};

export default helper;
