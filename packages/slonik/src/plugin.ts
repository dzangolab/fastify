import FastifyPlugin from "fastify-plugin";
import fastifySlonik from "fastify-slonik";
import { stringifyDsn } from "slonik";

import migratePlugin from "./migratePlugin";

import type { FastifyInstance } from "fastify";

const plugin = async (
  fastify: FastifyInstance,
  options: unknown,
  done: () => void
) => {
  const config = fastify.config.slonik;

  try {
    fastify.log.info("Registering fastify-slonik plugin");

    await fastify.register(fastifySlonik, {
      connectionString: stringifyDsn(config.db),
    });
  } catch (error: unknown) {
    fastify.log.error("🔴 Failed to connect, check your connection string");
    throw error;
  }

  // Run database migrations
  await fastify.register(migratePlugin);

  done();
};

export default FastifyPlugin(plugin);
