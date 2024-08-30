/* istanbul ignore file */
import { createMockPool, createMockQueryResult } from "slonik";

import type {
  PrimitiveValueExpression,
  QueryResult,
  QueryResultRow,
} from "slonik";
import type { Mock } from "vitest";

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
const helper = (query: Mock<any[], any>, result = [{}]) => {
  const pool = createMockPool({
    query: async (
      sql: string,
      values: readonly PrimitiveValueExpression[]
    ): Promise<QueryResult<QueryResultRow>> => {
      query(removeExtraSpace(sql), values);

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

  return sentence.replace(/\$slonik_/gu, "$").trim();
};

export default helper;

export { removeExtraSpace };
