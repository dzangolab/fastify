import type { ConnectionOptions, DatabasePool } from "slonik";
import type { ConnectionRoutine, QueryFunction } from "slonik/dist/src/types";

type Database = {
  connect: <T>(connectionRoutine: ConnectionRoutine<T>) => Promise<T>;
  pool: DatabasePool;
  query: QueryFunction;
};

type FilterInput = {
  AND: FilterInput[];
  OR: FilterInput[];
  key: string;
  operator: string;
  not: boolean;
  value: string;
};

type SlonikConfig = {
  db: ConnectionOptions;
  migrations: {
    path: string;
  };
};

type SortDirection = "ASC" | "DESC";

type SortInput = {
  key: string;
  direction: SortDirection;
};

type Tenant = {
  id: number;
  name: string;
  slug: string;
};

type TenantInput = Omit<Tenant, "id">;

export type {
  Database,
  FilterInput,
  SlonikConfig,
  SortInput,
  Tenant,
  TenantInput,
};
