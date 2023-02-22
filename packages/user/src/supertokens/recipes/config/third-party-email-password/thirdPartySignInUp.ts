import { getUserByThirdPartyInfo } from "supertokens-node/recipe/thirdpartyemailpassword";

import type { FastifyInstance } from "fastify";
import type { RecipeInterface } from "supertokens-node/recipe/thirdpartyemailpassword";

const thirdPartySignInUp = (
  originalImplementation: RecipeInterface,
  fastify: FastifyInstance
): typeof originalImplementation.thirdPartySignInUp => {
  const { config } = fastify;

  return async (input) => {
    const user = await getUserByThirdPartyInfo(
      input.thirdPartyId,
      input.thirdPartyUserId,
      input.userContext
    );

    if (!user && config.user.supertokens.features?.signUp) {
      throw {
        name: "SIGN_UP_DISABLED",
        message: "SignUp feature is currently disabled",
        statusCode: 404,
      };
    }

    const response = await originalImplementation.thirdPartySignInUp(input);

    return response;
  };
};

export default thirdPartySignInUp;
