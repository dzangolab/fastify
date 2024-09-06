/* istanbul ignore file */
import { newDb } from "pg-mem";

import fieldNameCaseConverter from "../../interceptors/fieldNameCaseConverter";

import type { SlonikAdapterOptions, IMemoryDb } from "pg-mem";

interface IOptions {
  db?: IMemoryDb;
  slonikAdapterOptions?: SlonikAdapterOptions;
}

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
const createDatabase = async (options?: IOptions) => {
  const db = options?.db ?? newDb();

  const defaultOptions: SlonikAdapterOptions = {
    createPoolOptions: {
      interceptors: [fieldNameCaseConverter],
    },
  };

  const mergedOptions: SlonikAdapterOptions = {
    ...defaultOptions,
    ...options?.slonikAdapterOptions,
    createPoolOptions: {
      ...defaultOptions.createPoolOptions,
      ...options?.slonikAdapterOptions?.createPoolOptions,
    },
  };

  const pool = await db.adapters.createSlonik(mergedOptions);

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

export default createDatabase;

export { removeExtraSpace };
