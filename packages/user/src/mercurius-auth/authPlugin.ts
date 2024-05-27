import FastifyPlugin from "fastify-plugin";
import mercurius from "mercurius";
import mercuriusAuth from "mercurius-auth";
import emailVerification from "supertokens-node/recipe/emailverification";

import ProfileValidationClaim from "../supertokens/utils/profileValidationClaim";

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
        !(await emailVerification.isEmailVerified(context.user.id))
      ) {
        // Added the claim validation errors to match with rest endpoint
        // response for email verification
        return new mercurius.ErrorWithProps(
          "invalid claim",
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

      if (fastify.config.user.features?.profileValidate?.enabled) {
        const response = authDirectiveAST.arguments.find(
          (argument: { name: { value: string } }) =>
            argument?.name?.value === "ignoreProfileValidation"
        )?.value?.value;

        if (!response) {
          const profileClaimValidator = await new ProfileValidationClaim(
            context.reply.request
          ).fetchValue(context.user.id, {});

          if (!profileClaimValidator) {
            return new mercurius.ErrorWithProps(
              "invalid claim",
              {
                claimValidationErrors: [
                  {
                    id: ProfileValidationClaim.key,
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
        }
      }

      return true;
    },

    authDirective: "auth",
  });
});

export default plugin;
