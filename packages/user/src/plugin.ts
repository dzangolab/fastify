import permissionPlugin, {
  PermissionService,
} from "@dzangolab/fastify-permission";
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

    // const role = await PermissionService.createNewRole({
    //   key: "test2",
    //   name: "test2",
    //   default: false,
    //   permissions: [1],
    // });

    // const role = await PermissionService.addRole(1, 1, 'users')
    // const role = await PermissionService.addRole(1, 1, 'org_user')

    // console.log("new role", role);

    fastify.decorate("hasPermission", hasPermission);

    if (graphql?.enabled) {
      await fastify.register(mercuriusAuthPlugin);
    }

    done();
  }
) as GraphqlEnabledPlugin;

plugin.updateContext = userContext;

export default plugin;
