import type { SlonikConfig } from "./types";
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import type { ApiConfig } from "@dzangolab/fastify-config";
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import type { FastifyInstance, FastifyRequest } from "fastify";
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

export type { Database, SlonikConfig, FilterInput, SortInput } from "./types";

export {
  createLimitFragment,
  createTableFragment,
  createTableIdentifier,
  createWhereIdFragment,
} from "./sql";

export { default as SqlFactory } from "./sqlFactory";
