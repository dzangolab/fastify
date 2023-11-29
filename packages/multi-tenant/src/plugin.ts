import FastifyPlugin from "fastify-plugin";
import merge from "lodash.merge";

import updateContext from "./lib/updateContext";
import recipes from "./supertokens/recipes";
import tenantDiscoveryPlugin from "./tenantDiscoveryPlugin";

import type { MercuriusEnabledPlugin } from "@dzangolab/fastify-mercurius";
import type { FastifyInstance } from "fastify";

const plugin = async (
  fastify: FastifyInstance,
  options: Record<string, never>,
  done: () => void
) => {
  fastify.log.info("Registering fastify-multi-tenant plugin");

  // Register domain discovery plugin
  await fastify.register(tenantDiscoveryPlugin);

  const { config } = fastify;

  const supertokensConfig = { recipes };

  // merge supertokens config
  config.user.supertokens = merge(supertokensConfig, config.user.supertokens);

  done();
};

const fastifyPlugin = FastifyPlugin(plugin) as MercuriusEnabledPlugin;

fastifyPlugin.updateContext = updateContext;

export default fastifyPlugin;
