import FastifyPlugin from "fastify-plugin";
import fastifySlonik from "fastify-slonik";
import { stringifyDsn } from "slonik";

import migrate from "./migrate";

import type { SlonikConfig } from "./types";
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import type { ApiConfig } from "@dzangolab/fastify-config";
import type { FastifyInstance, FastifyRequest } from "fastify";
import type { DatabasePool } from "slonik";
import type {
  ConnectionRoutine,
  QueryFunction,
  SqlTaggedTemplate,
} from "slonik/dist/src/types";

const plugin = async (
  fastify: FastifyInstance,
  options: unknown,
  done: () => void
) => {
  const config = fastify.config.slonik;

  try {
    fastify.log.info("Registering fastify-slonik plugin");

    fastify.register(fastifySlonik, {
      connectionString: stringifyDsn(config.db),
    });
  } catch (error: unknown) {
    fastify.log.error("🔴 Failed to connect, check your connection string");
    throw error;
  }

  fastify.log.info("Running database migrations");
  migrate(fastify.config);

  done();
};

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

export default FastifyPlugin(plugin);

export type { Database, SlonikConfig } from "./types";

export {
  createLimitFragment,
  createTableFragment,
  createWhereIdFragment,
} from "./sql";

export { default as SqlFactory } from "./sqlFactory";
