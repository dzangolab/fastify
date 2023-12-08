import FastifyPlugin from "fastify-plugin";

import runMigrations from "./migrations/runMigrations";

import type { FastifyInstance } from "fastify";

const plugin = async (
  fastify: FastifyInstance,
  options: Record<string, never>,
  done: () => void
) => {
  fastify.log.info("Registering fastify-firebase plugin");

  const { slonik } = fastify;

  await runMigrations(slonik);

  done();
};

export default FastifyPlugin(plugin);
