import { getUserByThirdPartyInfo } from "supertokens-node/recipe/thirdpartyemailpassword";

import type { Tenant } from "@dzangolab/fastify-multi-tenant";
import type { FastifyInstance, FastifyError } from "fastify";
import type { RecipeInterface } from "supertokens-node/recipe/thirdpartyemailpassword";

const thirdPartySignInUp = (
  originalImplementation: RecipeInterface,
  fastify: FastifyInstance
): typeof originalImplementation.thirdPartySignInUp => {
  return async (input) => {
    const tenant: Tenant | undefined = input.userContext.tenant;

    if (tenant) {
      input.thirdPartyUserId = tenant.id + "_" + input.thirdPartyUserId;
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
