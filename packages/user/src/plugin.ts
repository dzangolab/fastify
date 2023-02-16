import FastifyPlugin from "fastify-plugin";

import mercuriusAuthPlugin from "./mercurius-auth/plugin";
import supertokensPlugin from "./supertokens";

import type { FastifyInstance } from "fastify";

const plugin = async (
  fastify: FastifyInstance,
  options: Record<never, never>,
  done: () => void
) => {
  const { mercurius } = fastify.config;

  await fastify.register(supertokensPlugin);

  if (mercurius.enabled) {
    await fastify.register(mercuriusAuthPlugin);
  }

  done();
};

export default FastifyPlugin(plugin);
