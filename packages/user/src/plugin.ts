import FastifyPlugin from "fastify-plugin";

import mercuriusAuthPlugin from "./mercurius-auth/plugin";
import runMigrations from "./migrations/runMigrations";
import supertokensPlugin from "./supertokens";
import userContext from "./userContext";

import type { MercuriusEnabledPlugin } from "@dzangolab/fastify-mercurius";
import type { FastifyInstance } from "fastify";

const plugin = FastifyPlugin(
  async (
    fastify: FastifyInstance,
    options: Record<never, never>,
    done: () => void
  ) => {
    const { config, slonik } = fastify;

    await runMigrations(slonik, config);

    await fastify.register(supertokensPlugin);

    if (config.mercurius.enabled) {
      await fastify.register(mercuriusAuthPlugin);
    }

    done();
  }
) as MercuriusEnabledPlugin;

plugin.updateContext = userContext;

export default plugin;
