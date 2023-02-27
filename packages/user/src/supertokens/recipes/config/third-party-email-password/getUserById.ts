import updateTenantUser from "../../../utils/updateTenantUser";

import type { FastifyInstance } from "fastify";
import type { RecipeInterface } from "supertokens-node/recipe/thirdpartyemailpassword";

const getUserById = (
  originalImplementation: RecipeInterface,
  fastify: FastifyInstance
): typeof originalImplementation.getUserById => {
  return async (input) => {
    let user = await originalImplementation.getUserById(input);

    if (user) {
      user = updateTenantUser(user, fastify.tenant);
    }

    return user;
  };
};

export default getUserById;
