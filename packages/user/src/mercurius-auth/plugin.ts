import FastifyPlugin from "fastify-plugin";
import mercurius from "mercurius";
import mercuriusAuth from "mercurius-auth";
import emailVerificaiton from "supertokens-node/recipe/emailverification";

import type { FastifyInstance } from "fastify";

const plugin = FastifyPlugin(async (fastify: FastifyInstance) => {
  const mercuriusConfig = fastify.config.mercurius;

  if (mercuriusConfig.enabled) {
    await fastify.register(mercuriusAuth, {
      async applyPolicy(authDirectiveAST, parent, arguments_, context) {
        if (!context.user) {
          return new mercurius.ErrorWithProps("unauthorized", {}, 401);
        }

        if (
          fastify.config.user.features?.signUp?.emailVerification &&
          !(await emailVerificaiton.isEmailVerified(context.user.id))
        ) {
          return new mercurius.ErrorWithProps("invalid claim", {}, 403);
        }

        return true;
      },

      authDirective: "auth",
    });
  }
});

export default plugin;
