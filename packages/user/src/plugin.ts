import permissionPlugin from "@dzangolab/fastify-permission";
import FastifyPlugin from "fastify-plugin";

import mercuriusAuthPlugin from "./mercurius-auth/plugin";
import hasPermission from "./middlewares/hasPermission";
import supertokensPlugin from "./supertokens";
import userContext from "./userContext";

import type { GraphqlEnabledPlugin } from "@dzangolab/fastify-graphql";
import type { FastifyInstance } from "fastify";

const plugin = FastifyPlugin(
  async (
    fastify: FastifyInstance,
    options: Record<never, never>,
    done: () => void
  ) => {
    const { graphql } = fastify.config;

    await fastify.register(supertokensPlugin);

    await fastify.register(permissionPlugin);

    fastify.decorate("hasPermission", hasPermission);

    if (graphql?.enabled) {
      await fastify.register(mercuriusAuthPlugin);
    }

    done();
  }
) as GraphqlEnabledPlugin;

plugin.updateContext = userContext;

export default plugin;
