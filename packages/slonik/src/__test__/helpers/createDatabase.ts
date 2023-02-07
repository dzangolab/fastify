/* istanbul ignore file */
import { createMockPool, createMockQueryResult } from "slonik";

import type {
  PrimitiveValueExpression,
  QueryResult,
  QueryResultRow,
} from "slonik";

const helper = (result = [{}]) => {
  const pool = createMockPool({
    query: async (
      sql: string,
      values: readonly PrimitiveValueExpression[]
    ): Promise<QueryResult<QueryResultRow>> => {
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
