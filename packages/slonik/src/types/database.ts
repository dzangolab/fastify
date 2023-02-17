import type { DatabasePool } from "slonik";
import type { ConnectionRoutine, QueryFunction } from "slonik/dist/src/types";

type Database = {
  connect: <T>(connectionRoutine: ConnectionRoutine<T>) => Promise<T>;
  pool: DatabasePool;
  query: QueryFunction;
};

interface BaseFilterInput {
  key: string;
  operator: string;
  not?: boolean;
  value: string | number;
}

interface LogicalFilterInput {
  AND?: FilterInput[];
  OR?: FilterInput[];
}

type FilterInput = LogicalFilterInput | BaseFilterInput;

type SortDirection = "ASC" | "DESC";

type SortInput = {
  key: string;
  direction: SortDirection;
};

export type {
  BaseFilterInput,
  Database,
  FilterInput,
  LogicalFilterInput,
  SortInput,
};
