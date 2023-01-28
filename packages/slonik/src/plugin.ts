import FastifyPlugin from "fastify-plugin";
import { stringifyDsn } from "slonik";

import migrate from "./migrate";
import { fastifySlonik } from "./slonik";

import type { FastifyInstance } from "fastify";

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
      clientConfiguration: config?.client,
    });
  } catch (error: unknown) {
    fastify.log.error("🔴 Failed to connect, check your connection string");
    throw error;
  }

  fastify.log.info("Running database migrations");
  await migrate(fastify.config);

  done();
};

export default FastifyPlugin(plugin);
