import FastifyPlugin from "fastify-plugin";

import mercuriusAuthPlugin from "./mercurius-auth/plugin";
import runMigrations from "./runMigrations";
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
    const { mercurius } = fastify.config;

    await fastify.register(supertokensPlugin);

    if (mercurius.enabled) {
      await fastify.register(mercuriusAuthPlugin);
    }

    // Run package migrations
    await runMigrations(fastify);

    done();
  }
) as MercuriusEnabledPlugin;

plugin.updateContext = userContext;

export default plugin;
