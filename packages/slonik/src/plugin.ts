import FastifyPlugin from "fastify-plugin";
import { sql, stringifyDsn } from "slonik";

import createClientConfiguration from "./factories/createClientConfiguration";
import migrate from "./migrate";
import { fastifySlonik } from "./slonik";

import type { FastifyInstance } from "fastify";

const plugin = async (
  fastify: FastifyInstance,
  options: unknown,
  done: () => void
) => {
  const config = fastify.config.slonik;

  fastify.log.info("Registering fastify-slonik plugin");

  await fastify.register(fastifySlonik, {
    connectionString: stringifyDsn(config.db),
    clientConfiguration: createClientConfiguration(config?.clientConfiguration),
  });

  if (config.db.schema && config.db.schema !== "public") {
    await fastify.slonik.connect(async (connection) => {
      const query = sql.unsafe`CREATE SCHEMA IF NOT EXISTS ${sql.identifier([
        config.db.schema as string,
      ])};`;
      await connection.query(query);
    });
  }

  fastify.log.info("Running database migrations");
  await migrate(fastify.config);

  fastify.decorateRequest("dbSchema", "");

  done();
};

export default FastifyPlugin(plugin);
