import { sendEmail } from "@dzangolab/fastify-user";
import { getUserById } from "supertokens-node/recipe/thirdpartyemailpassword";

import type { FastifyInstance } from "fastify";
import type { RecipeInterface } from "supertokens-node/recipe/thirdpartyemailpassword/types";

const resetPasswordUsingToken = (
  originalImplementation: RecipeInterface,
  fastify: FastifyInstance
): RecipeInterface["resetPasswordUsingToken"] => {
  return async (input) => {
    const originalResponse =
      await originalImplementation.resetPasswordUsingToken(input);

    if (originalResponse.status === "OK" && originalResponse.userId) {
      const user = await getUserById(originalResponse.userId, {
        tenant: input.userContext._default.request.request.tenant,
      });

      if (user) {
        sendEmail({
          fastify,
          subject: "Reset Password Notification",
          templateName: "reset-password-notification",
          to: user.email,
          templateData: {
            emailId: user.email,
          },
        });
      }
    }

    return originalResponse;
  };
};

export default resetPasswordUsingToken;
