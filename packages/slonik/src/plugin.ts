import FastifyPlugin from "fastify-plugin";
import { stringifyDsn } from "slonik";

import createClientConfiguration from "./factories/createClientConfiguration";
import runPackageMigrations from "./migrations/runPackageMigrations";
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

  if (config.migrations?.package !== false) {
    // [DU 2024-MAY-21] multiple statements in a single query is not supported
    // await runPackageMigrations(fastify.slonik);
  }

  fastify.decorateRequest("dbSchema", "");

  done();
};

export default FastifyPlugin(plugin);
