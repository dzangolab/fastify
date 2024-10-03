import FastifyPlugin from "fastify-plugin";

import mercuriusAuthPlugin from "./mercurius-auth/plugin";
import hasPermission from "./middlewares/hasPermission";
import invitationsRoutes from "./model/invitations/controller";
import permissionsRoutes from "./model/permissions/controller";
import rolesRoutes from "./model/roles/controller";
import usersRoutes from "./model/users/controller";
import supertokensPlugin from "./supertokens";
import userContext from "./userContext";

import type { GraphqlEnabledPlugin } from "@dzangolab/fastify-graphql";
import type { FastifyInstance } from "fastify";

const plugin = FastifyPlugin(
  async (
    fastify: FastifyInstance,
    options: Record<never, never>,
    done: () => void,
  ) => {
    const { graphql } = fastify.config;

    await fastify.register(supertokensPlugin);

    fastify.decorate("hasPermission", hasPermission);

    if (graphql?.enabled) {
      await fastify.register(mercuriusAuthPlugin);
    }

    const routes = fastify.config.user.routes;

    if (routes?.invitations?.enabled) {
      await fastify.register(invitationsRoutes);
    }

    if (routes?.permissions?.enabled) {
      await fastify.register(permissionsRoutes);
    }

    if (routes?.roles?.enabled) {
      await fastify.register(rolesRoutes);
    }

    if (routes?.users?.enabled) {
      await fastify.register(usersRoutes);
    }

    done();
  },
) as GraphqlEnabledPlugin;

plugin.updateContext = userContext;

export default plugin;
