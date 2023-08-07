import { sql } from "slonik";

import type { SlonikConfig } from "./types";
import type { ConnectionRoutine, DatabasePool, QueryFunction } from "slonik";

declare module "fastify" {
  interface FastifyInstance {
    slonik: {
      connect: <T>(connectionRoutine: ConnectionRoutine<T>) => Promise<T>;
      pool: DatabasePool;
      query: QueryFunction;
    };
    sql: typeof sql;
  }

  interface FastifyRequest {
    dbSchema: string;
    slonik: {
      connect: <T>(connectionRoutine: ConnectionRoutine<T>) => Promise<T>;
      pool: DatabasePool;
      query: QueryFunction;
    };
    sql: typeof sql;
  }
}

declare module "@dzangolab/fastify-config" {
  interface ApiConfig {
    slonik: SlonikConfig;
  }
}

export { default } from "./plugin";

export { applyFilter, applyFiltersToQuery } from "./dbFilters";

export {
  createFilterFragment,
  createLimitFragment,
  createSortFragment,
  createTableFragment,
  createTableIdentifier,
  createWhereIdFragment,
} from "./sql";

export { default as createDatabase } from "./createDatabase";
export { default as BaseService } from "./service";
export { default as DefaultSqlFactory } from "./sqlFactory";

export type {
  Database,
  FilterInput,
  PaginatedList,
  Service,
  SlonikConfig,
  SortInput,
  SqlFactory,
} from "./types";
