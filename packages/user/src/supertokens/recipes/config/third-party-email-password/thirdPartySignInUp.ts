import { getUserByThirdPartyInfo } from "supertokens-node/recipe/thirdpartyemailpassword";

import getMappedId from "../../../utils/getMappedId";

import type { Tenant } from "../../../../types";
import type { FastifyInstance, FastifyError } from "fastify";
import type { RecipeInterface } from "supertokens-node/recipe/thirdpartyemailpassword";

const thirdPartySignInUp = (
  originalImplementation: RecipeInterface,
  fastify: FastifyInstance
): RecipeInterface["thirdPartySignInUp"] => {
  return async (input) => {
    const tenant: Tenant | undefined = input.userContext.tenant;

    if (tenant) {
      const tenantId = tenant[getMappedId(fastify.config)];

      input.thirdPartyUserId = tenantId + "_" + input.thirdPartyUserId;
    }

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
