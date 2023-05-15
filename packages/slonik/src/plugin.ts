import FastifyPlugin from "fastify-plugin";
import { stringifyDsn } from "slonik";

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

  fastify.register(fastifySlonik, {
    connectionString: stringifyDsn(config.db),
    clientConfiguration: createClientConfiguration(config?.clientConfiguration),
  });

  fastify.log.info("Running database migrations");
  await migrate(fastify.config);

  fastify.decorateRequest("dbSchema", "");

  done();
};

export default FastifyPlugin(plugin);
