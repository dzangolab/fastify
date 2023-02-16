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
  value: string;
}

type AndFilter = {
  AND: FilterInput[];
};

type OrFilter = {
  OR: FilterInput[];
};

type LogicalFilterInput = AndFilter | OrFilter;

type FilterInput = BaseFilterInput | LogicalFilterInput;

type SortDirection = "ASC" | "DESC";

type SortInput = {
  key: string;
  direction: SortDirection;
};

export type { Database, FilterInput, SortInput };
