import type { ConnectionRoutine, DatabasePool, QueryFunction } from "slonik";

type Database = {
  connect: <T>(connectionRoutine: ConnectionRoutine<T>) => Promise<T>;
  pool: DatabasePool;
  query: QueryFunction;
};

type operator =
  | "ct"
  | "sw"
  | "ew"
  | "eq"
  | "gt"
  | "gte"
  | "lte"
  | "lt"
  | "in"
  | "bt";

type FilterInput = {
  AND: FilterInput[];
  OR: FilterInput[];
  key: string;
  operator: operator;
  not?: boolean;
  value: string;
};

type SortDirection = "ASC" | "DESC";

type SortInput = {
  key: string;
  direction: SortDirection;
};

export type { Database, FilterInput, SortDirection, SortInput };
