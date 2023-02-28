import { getUserByThirdPartyInfo } from "supertokens-node/recipe/thirdpartyemailpassword";

import updateThirdPartyUserId from "../../../utils/updateThirdPartyUserId";

import type { FastifyInstance, FastifyError } from "fastify";
import type { RecipeInterface } from "supertokens-node/recipe/thirdpartyemailpassword";

const thirdPartySignInUp = (
  originalImplementation: RecipeInterface,
  fastify: FastifyInstance
): typeof originalImplementation.thirdPartySignInUp => {
  return async (input) => {
    const tenant = input.userContext._default.request.original.tenant;

    input.thirdPartyUserId = updateThirdPartyUserId.appendTenantId(
      input.thirdPartyUserId,
      tenant
    );

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
