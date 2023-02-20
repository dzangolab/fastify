/* istanbul ignore file */
import { createMockPool, createMockQueryResult } from "slonik";

import type {
  PrimitiveValueExpression,
  QueryResult,
  QueryResultRow,
} from "slonik";
import type { Mock } from "vitest";

const helper = (
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  query: Mock<any[], any>,
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  result: any = [{}]
) => {
  const pool = createMockPool({
    query: async (
      sql: string,
      values: readonly PrimitiveValueExpression[]
    ): Promise<QueryResult<QueryResultRow>> => {
      query(removeExtraSpace(sql), values);

      if (result[0]?.sql) {
        for (const r of result) {
          if (removeExtraSpace(r.sql).includes(removeExtraSpace(sql))) {
            return createMockQueryResult(r.result);
          }
        }
      }

      return createMockQueryResult(result);
    },
  });

  return {
    connect: pool.connect.bind(pool),
    pool,
    query: pool.query.bind(pool),
  };
};

const removeExtraSpace = (lines: string): string => {
  let sentence = "";

  for (const line of lines.split("\n")) {
    sentence += line.trim() + " ";
  }

  return sentence.trim();
};

export default helper;

export { removeExtraSpace };
