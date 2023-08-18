import FastifyPlugin from "fastify-plugin";
import mercurius from "mercurius";
import mercuriusAuth from "mercurius-auth";

import type { FastifyInstance } from "fastify";

const plugin = FastifyPlugin(async (fastify: FastifyInstance) => {
  const mercuriusConfig = fastify.config.mercurius;

  if (mercuriusConfig.enabled) {
    await fastify.register(mercuriusAuth, {
      async applyPolicy(authDirectiveAST, parent, arguments_, context) {
        if (!context.user) {
          return new mercurius.ErrorWithProps("unauthorized", {}, 200);
        }

        return true;
      },

      authDirective: "auth",
    });
  }
});

export default plugin;
