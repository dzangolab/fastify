import FastifyPlugin from "fastify-plugin";
import merge from "lodash.merge";

import thirdPartyEmailPasswordConfig from "./config";
import userContext from "./config/userContext";
import { mutation, query } from "./config/users/resolver";
import updateContext from "./lib/updateContext";
import migratePlugin from "./migratePlugin";
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

  const graphql = {
    resolver: {
      mutation,
      query,
    },
  };

  config.user.graphql = merge(graphql, config.user.graphql);

  config.user.context = userContext;

  done();
};

const fastifyPlugin = FastifyPlugin(plugin) as MercuriusEnabledPlugin;

fastifyPlugin.updateContext = updateContext;

export default fastifyPlugin;
