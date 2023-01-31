/* istanbul ignore file */
import { createMockPool, createMockQueryResult } from "slonik";

const helper = () => {
  const pool = createMockPool({
    query: async () => {
      return createMockQueryResult([
        {
          foo: "bar",
        },
      ]);
    },
  });

  return {
    connect: pool.connect.bind(pool),
    pool,
    query: pool.query.bind(pool),
  };
};

export default helper;
