import type { SlonikConfig } from "./types";
import type { DatabasePool } from "slonik";
import type {
  ConnectionRoutine,
  QueryFunction,
  SqlTaggedTemplate,
} from "slonik/dist/src/types";

declare module "fastify" {
  interface FastifyInstance {
    slonik: {
      connect: <T>(connectionRoutine: ConnectionRoutine<T>) => Promise<T>;
      pool: DatabasePool;
      query: QueryFunction;
    };
    sql: SqlTaggedTemplate<Record<never, never>>;
  }

  interface FastifyRequest {
    slonik: {
      connect: <T>(connectionRoutine: ConnectionRoutine<T>) => Promise<T>;
      pool: DatabasePool;
      query: QueryFunction;
    };
    sql: SqlTaggedTemplate<Record<never, never>>;
  }
}

declare module "@dzangolab/fastify-config" {
  interface ApiConfig {
    slonik: SlonikConfig;
  }
}

export { default } from "./plugin";

export type {
  Database,
  SlonikConfig,
  SlonikEnabledConfig,
  FilterInput,
  SortInput,
} from "./types";

export {
  createFilterFragment,
  createLimitFragment,
  createSortFragment,
  createTableFragment,
  createTableIdentifier,
  createWhereIdFragment,
} from "./sql";

export { default as SqlFactory } from "./sqlFactory";
