import FastifyPlugin from "fastify-plugin";
import mercurius from "mercurius";
import mercuriusAuth from "mercurius-auth";
import emailVerificaiton from "supertokens-node/recipe/emailverification";

import type { FastifyInstance } from "fastify";

const plugin = FastifyPlugin(async (fastify: FastifyInstance) => {
  await fastify.register(mercuriusAuth, {
    async applyPolicy(authDirectiveAST, parent, arguments_, context) {
      if (!context.user) {
        return new mercurius.ErrorWithProps("unauthorized", {}, 401);
      }

      if (context.user.disabled) {
        return new mercurius.ErrorWithProps("user is disabled", {}, 401);
      }

      if (
        fastify.config.user.features?.signUp?.emailVerification &&
        !(await emailVerificaiton.isEmailVerified(context.user.id))
      ) {
        // Added the claim validation errors to match with rest endpoint
        // response for email verification
        return new mercurius.ErrorWithProps(
          "INVALID_CLAIMS",
          {
            claimValidationErrors: [
              {
                id: "st-ev",
                reason: {
                  message: "wrong value",
                  expectedValue: true,
                  actualValue: false,
                },
              },
            ],
          },
          403
        );
      }

      return true;
    },

    authDirective: "auth",
  });
});

export default plugin;
