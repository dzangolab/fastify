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
    const { graphql, user } = fastify.config;

    await fastify.register(supertokensPlugin);

    fastify.decorate("hasPermission", hasPermission);

    if (graphql?.enabled) {
      await fastify.register(mercuriusAuthPlugin);
    }

    const { routePrefix, routes } = user;

    if (!routes?.invitations?.disabled) {
      await fastify.register(invitationsRoutes, { prefix: routePrefix });
    }

    if (!routes?.permissions?.disabled) {
      await fastify.register(permissionsRoutes, { prefix: routePrefix });
    }

    if (!routes?.roles?.disabled) {
      await fastify.register(rolesRoutes, { prefix: routePrefix });
    }

    if (!routes?.users?.disabled) {
      await fastify.register(usersRoutes, { prefix: routePrefix });
    }

    done();
  },
) as GraphqlEnabledPlugin;

plugin.updateContext = userContext;

export default plugin;
