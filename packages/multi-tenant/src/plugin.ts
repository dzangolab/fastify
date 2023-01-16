import FastifyPlugin from "fastify-plugin";

import migratePlugin from "./migratePlugin";
import domainDiscoveryPlugin from "./tenantDiscoveryPlugin";

import type { FastifyInstance } from "fastify";

const plugin = async (
  fastify: FastifyInstance,
  options: Record<string, never>,
  done: () => void
) => {
  fastify.log.info("Registering fastify-multi-tenant plugin");

  // Register migrate plugin
  await fastify.register(migratePlugin);

  // Register domain discovery plugin
  await fastify.register(domainDiscoveryPlugin);

  done();
};

export default FastifyPlugin(plugin);
