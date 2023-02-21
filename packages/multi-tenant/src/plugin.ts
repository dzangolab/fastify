import FastifyPlugin from "fastify-plugin";

import migratePlugin from "./migratePlugin";
import tenantContext from "./tenantContext";
import tenantDiscoveryPlugin from "./tenantDiscoveryPlugin";

import type { MercuriusEnabledPlugin } from "@dzangolab/fastify-mercurius";
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
  await fastify.register(tenantDiscoveryPlugin);

  done();
};

const fastifyPlugin = FastifyPlugin(plugin) as MercuriusEnabledPlugin;

fastifyPlugin.updateContext = tenantContext;

export default fastifyPlugin;
