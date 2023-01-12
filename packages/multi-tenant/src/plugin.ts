import FastifyPlugin from "fastify-plugin";

import migratePlugin from "./migratePlugin";

import type { FastifyInstance } from "fastify";

const plugin = async (
  fastify: FastifyInstance,
  options: Record<string, never>,
  done: () => void
) => {
  fastify.log.info("Registering fastify-multi-tenant plugin");

  // Register migrate Plugin
  await fastify.register(migratePlugin);

  // TODO Register domain discovery plugin

  done();
};

export default FastifyPlugin(plugin);
