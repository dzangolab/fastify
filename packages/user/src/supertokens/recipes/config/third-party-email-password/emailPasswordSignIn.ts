import Email from "../../../utils/email";

import type { FastifyInstance } from "fastify";
import type { RecipeInterface } from "supertokens-node/recipe/thirdpartyemailpassword";

const emailPasswordSignIn = (
  originalImplementation: RecipeInterface,
  fastify: FastifyInstance
): RecipeInterface["emailPasswordSignIn"] => {
  return async (input) => {
    const originalEmail = input.email;

    input.email = Email.addTenantPrefix(
      fastify.config,
      input.email,
      input.userContext.tenant
    );

    let originalResponse = await originalImplementation.emailPasswordSignIn(
      input
    );

    if (originalResponse.status === "OK") {
      originalResponse = {
        ...originalResponse,
        user: { ...originalResponse.user, email: originalEmail },
      };
    }

    return originalResponse;
  };
};

export default emailPasswordSignIn;
