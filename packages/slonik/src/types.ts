import type { ConnectionOptions, DatabasePool } from "slonik";
import type { ConnectionRoutine, QueryFunction } from "slonik/dist/src/types";

type Database = {
  connect: <T>(connectionRoutine: ConnectionRoutine<T>) => Promise<T>;
  pool: DatabasePool;
  query: QueryFunction;
};

type SlonikConfig = {
  db: ConnectionOptions;
  migrations: {
    development: string;
    production: string;
  };
};

type FilterInput = {
  AND: FilterInput[];
  OR: FilterInput[];
  key: string;
  operator: string;
  not: boolean;
  value: string;
};

export type { Database, SlonikConfig, FilterInput };
