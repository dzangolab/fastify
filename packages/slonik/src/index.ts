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

export { default as migratePlugin } from "./migratePlugin";

export { default as TenantService } from "./model/tenants/service";

export { default } from "./plugin";

export { default as runMigrations } from "./runMigrations";

export {
  createLimitFragment,
  createTableFragment,
  createWhereIdFragment,
} from "./sql";

export { default as SqlFactory } from "./sqlFactory";

export { default as getMigrateDatabaseConfig } from "./utils/getMigrateDatabaseConfig";

export type {
  Database,
  FilterInput,
  SlonikConfig,
  SortInput,
  Tenant,
  TenantInput,
} from "./types";
