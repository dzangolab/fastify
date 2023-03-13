// [OP 2023-JAN-28] Copy/pasted from https://github.com/spa5k/fastify-slonik/blob/main/src/index.ts
import fastifyPlugin from "fastify-plugin";
import { sql } from "slonik";

import createDatabase from "./createDatabase";

import type { Database } from "./types";
import type { FastifyInstance } from "fastify";
import type { DatabasePool } from "slonik";
import type {
  ClientConfigurationInput,
  ConnectionRoutine,
  QueryFunction,
} from "slonik/dist/src/types";

type SlonikOptions = {
  connectionString: string;
  clientConfiguration?: ClientConfigurationInput;
};

declare module "fastify" {
  interface FastifyRequest {
    slonik: {
      connect: <T>(connectionRoutine: ConnectionRoutine<T>) => Promise<T>;
      pool: DatabasePool;
      query: QueryFunction;
    };
    sql: typeof sql;
  }

  interface FastifyInstance {
    slonik: {
      connect: <T>(connectionRoutine: ConnectionRoutine<T>) => Promise<T>;
      pool: DatabasePool;
      query: QueryFunction;
    };
    sql: typeof sql;
  }
}

const plugin = async (fastify: FastifyInstance, options: SlonikOptions) => {
  const { connectionString, clientConfiguration } = options;
  let db: Database;

  try {
    db = await createDatabase(connectionString, clientConfiguration);

    await db.pool.connect(async () => {
      fastify.log.info("✅ Connected to Postgres DB");
    });
  } catch (error) {
    fastify.log.error("🔴 Error happened while connecting to Postgres DB");
    throw new Error(error as string);
  }

  if (!fastify.hasDecorator("slonik") && !fastify.hasDecorator("sql")) {
    fastify.decorate("slonik", db);
    fastify.decorate("sql", sql);
  }

  if (
    !fastify.hasRequestDecorator("slonik") &&
    !fastify.hasRequestDecorator("sql")
  ) {
    /* eslint-disable unicorn/no-null */
    fastify.decorateRequest("slonik", null);
    fastify.decorateRequest("sql", null);
    /* eslint-enable */

    fastify.addHook("onRequest", async (req) => {
      req.slonik = db;
      req.sql = sql;
    });
  }
};

export const fastifySlonik = fastifyPlugin(plugin, {
  fastify: "4.x",
  name: "fastify-slonik",
});

// eslint-disable-next-line import/no-default-export
export default fastifyPlugin(plugin, {
  fastify: "4.x",
  name: "fastify-slonik",
});
