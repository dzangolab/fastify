import FastifyPlugin from "fastify-plugin";

import mercuriusAuthPlugin from "./mercurius-auth/plugin";
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
    // [DU 2023-JUL-12] This helps supertokens to create and attach session to reply.
    await fastify.addHook("onRequest", (request, reply, done) => {
      reply.setHeader = function (key, value) {
        return this.raw.setHeader(key, value);
      };

      done();
    });

    const { mercurius } = fastify.config;

    await fastify.register(supertokensPlugin);

    if (mercurius.enabled) {
      await fastify.register(mercuriusAuthPlugin);
    }

    done();
  }
) as MercuriusEnabledPlugin;

plugin.updateContext = userContext;

export default plugin;
