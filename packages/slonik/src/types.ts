import type { ConnectionOptions, DatabasePool } from "slonik";
import type {
  ClientConfigurationInput,
  ConnectionRoutine,
  QueryFunction,
} from "slonik/dist/src/types";

type Database = {
  connect: <T>(connectionRoutine: ConnectionRoutine<T>) => Promise<T>;
  pool: DatabasePool;
  query: QueryFunction;
};

type SlonikConfig = {
  clientConfiguration?: ClientConfigurationInput;
  db: ConnectionOptions;
  migrations?: {
    path: string;
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

type SortDirection = "ASC" | "DESC";

type SortInput = {
  key: string;
  direction: SortDirection;
};

export type { Database, SlonikConfig, FilterInput, SortInput };
