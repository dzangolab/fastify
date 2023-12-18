import FastifyPlugin from "fastify-plugin";

import { initializeFirebase } from "./lib";
import runMigrations from "./migrations/runMigrations";

import type { FastifyInstance } from "fastify";

const plugin = async (
  fastify: FastifyInstance,
  options: Record<string, never>,
  done: () => void
) => {
  fastify.log.info("Registering fastify-firebase plugin");

  const { config, slonik } = fastify;

  await runMigrations(slonik, config);

  initializeFirebase(config);

  done();
};

export default FastifyPlugin(plugin);
