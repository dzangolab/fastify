/* istanbul ignore file */
import { createMockPool, createMockQueryResult } from "slonik";

import type { PrimitiveValueExpression } from "slonik/dist/src/types";
import type { Mock } from "vitest";

/*eslint-disable-next-line @typescript-eslint/no-explicit-any */
export const createDatabase = (query: Mock<any[], any>) => {
  const pool = createMockPool({
    query: async (sql: string, values: readonly PrimitiveValueExpression[]) => {
      query(removeExtraSpace(sql), values);
      return createMockQueryResult([{}]);
    },
  });
  return {
    connect: pool.connect.bind(pool),
    pool,
    query: pool.query.bind(pool),
  };
};

export const removeExtraSpace = (lines: string): string => {
  let sentence = "";

  for (const line of lines.split("\n")) {
    sentence += line.trim() + " ";
  }

  return sentence.trim();
};
