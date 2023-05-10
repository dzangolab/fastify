import FastifyPlugin from "fastify-plugin";
import merge from "lodash.merge";

import updateContext from "./lib/updateContext";
import migratePlugin from "./migratePlugin";
import thirdPartyEmailPasswordConfig from "./supertokens/recipes";
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

  const { config } = fastify;

  const supertokensConfig = {
    recipes: {
      thirdPartyEmailPassword: thirdPartyEmailPasswordConfig,
    },
  };

  // merge supertokens config
  config.user.supertokens = merge(supertokensConfig, config.user.supertokens);

  done();
};

const fastifyPlugin = FastifyPlugin(plugin) as MercuriusEnabledPlugin;

fastifyPlugin.updateContext = updateContext;

export default fastifyPlugin;
