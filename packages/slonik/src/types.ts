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
    path: string;
  };
};

export type { Database, SlonikConfig };
