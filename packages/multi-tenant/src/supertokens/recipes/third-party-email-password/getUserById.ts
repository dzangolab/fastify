import Email from "../../utils/email";

import type { FastifyInstance } from "fastify";
import type { RecipeInterface } from "supertokens-node/recipe/thirdpartyemailpassword";

const getUserById = (
  originalImplementation: RecipeInterface,
  fastify: FastifyInstance,
): RecipeInterface["getUserById"] => {
  return async (input) => {
    let user = await originalImplementation.getUserById(input);

    if (user && input.userContext && input.userContext.tenant) {
      user = {
        ...user,
        email: Email.removeTenantPrefix(
          fastify.config,
          user.email,
          input.userContext.tenant,
        ),
      };
    }

    return user;
  };
};

export default getUserById;
