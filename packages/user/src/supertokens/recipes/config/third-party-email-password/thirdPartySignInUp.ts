import { getUserByThirdPartyInfo } from "supertokens-node/recipe/thirdpartyemailpassword";

import updateEmail from "../../../utils/updateEmail";

import type { FastifyInstance, FastifyError } from "fastify";
import type { RecipeInterface } from "supertokens-node/recipe/thirdpartyemailpassword";

const thirdPartySignInUp = (
  originalImplementation: RecipeInterface,
  fastify: FastifyInstance
): typeof originalImplementation.thirdPartySignInUp => {
  return async (input) => {
    input.email = updateEmail.appendTenantId(input.email, fastify.tenant);

    const user = await getUserByThirdPartyInfo(
      input.thirdPartyId,
      input.thirdPartyUserId,
      input.userContext
    );

    if (!user && fastify.config.user.features?.signUp === false) {
      throw {
        name: "SIGN_UP_DISABLED",
        message: "SignUp feature is currently disabled",
        statusCode: 404,
      } as FastifyError;
    }

    const response = await originalImplementation.thirdPartySignInUp(input);

    return response;
  };
};

export default thirdPartySignInUp;
