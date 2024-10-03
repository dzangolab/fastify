import FastifyPlugin from "fastify-plugin";
import merge from "lodash.merge";

import createTenantOwnerRole from "./lib/createTenantOwnerRole";
import updateContext from "./lib/updateContext";
import tenantsRoutes from "./model/tenants/controller";
import recipes from "./supertokens/recipes";
import tenantDiscoveryPlugin from "./tenantDiscoveryPlugin";

import type { GraphqlEnabledPlugin } from "@dzangolab/fastify-graphql";
import type { FastifyInstance } from "fastify";

const plugin = async (
  fastify: FastifyInstance,
  options: Record<string, never>,
  done: () => void,
) => {
  fastify.log.info("Registering fastify-multi-tenant plugin");

  // Register domain discovery plugin
  await fastify.register(tenantDiscoveryPlugin);

  const { config } = fastify;

  const supertokensConfig = { recipes };

  // merge supertokens config
  config.user.supertokens = merge(supertokensConfig, config.user.supertokens);

  fastify.addHook("onReady", async () => {
    await createTenantOwnerRole();
  });

  // register tenants routes
  await fastify.register(tenantsRoutes);

  done();
};

const fastifyPlugin = FastifyPlugin(plugin) as GraphqlEnabledPlugin;

fastifyPlugin.updateContext = updateContext;

export default fastifyPlugin;
