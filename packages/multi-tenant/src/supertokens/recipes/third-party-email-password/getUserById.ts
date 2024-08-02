import { getRequestFromUserContext } from "supertokens-node";

import Email from "../../utils/email";

import type { FastifyInstance, FastifyRequest } from "fastify";
import type { RecipeInterface } from "supertokens-node/recipe/thirdpartyemailpassword";

const getUserById = (
  originalImplementation: RecipeInterface,
  fastify: FastifyInstance
): RecipeInterface["getUserById"] => {
  return async (input) => {
    let user = await originalImplementation.getUserById(input);

    if (user) {
      const request = getRequestFromUserContext(input.userContext)?.original as
        | FastifyRequest
        | undefined;

      user = {
        ...user,
        email: Email.removeTenantPrefix(
          fastify.config,
          user.email,
          input.userContext.tenant || request?.tenant
        ),
      };
    }

    return user;
  };
};

export default getUserById;
