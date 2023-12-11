import FastifyPlugin from "fastify-plugin";
import merge from "lodash.merge";

import acceptInvitation from "./invitations/handler/acceptInvitation";
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

  const handlers = {
    invitation: {
      accept: acceptInvitation,
    },
  };

  // merge handlers
  config.user.handlers = merge(handlers, config.user.handlers);

  done();
};

const fastifyPlugin = FastifyPlugin(plugin) as MercuriusEnabledPlugin;

fastifyPlugin.updateContext = updateContext;

export default fastifyPlugin;
