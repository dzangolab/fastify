import sendEmail from "../../../utils/sendEmail";
import updateEmail from "../../../utils/updateEmail";

import type { FastifyInstance, FastifyError } from "fastify";
import type { RecipeInterface } from "supertokens-node/recipe/thirdpartyemailpassword";

const emailPasswordSignUp = (
  originalImplementation: RecipeInterface,
  fastify: FastifyInstance
): typeof originalImplementation.emailPasswordSignUp => {
  const { config, log } = fastify;

  return async (input) => {
    if (config.user.features?.signUp === false) {
      throw {
        name: "SIGN_UP_DISABLED",
        message: "SignUp feature is currently disabled",
        statusCode: 404,
      } as FastifyError;
    }

    const originalResponse = await originalImplementation.emailPasswordSignUp(
      input
    );

    if (
      config.user.supertokens.sendUserAlreadyExistsWarning &&
      originalResponse.status === "EMAIL_ALREADY_EXISTS_ERROR"
    ) {
      try {
        input.email = updateEmail.removeTenantId(
          input.email,
          input.userContext.tenant
        );

        await sendEmail({
          fastify,
          subject: "Duplicate Email Registration",
          templateData: {
            emailId: input.email,
          },
          templateName: "duplicate-email-warning",
          to: input.email,
        });
      } catch (error) {
        log.error(error);
      }
    }

    return originalResponse;
  };
};

export default emailPasswordSignUp;
