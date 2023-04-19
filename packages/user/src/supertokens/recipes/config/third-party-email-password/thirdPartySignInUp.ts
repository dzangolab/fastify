import { getUserByThirdPartyInfo } from "supertokens-node/recipe/thirdpartyemailpassword";
import UserRoles from "supertokens-node/recipe/userroles";

import type { FastifyInstance, FastifyError } from "fastify";
import type { RecipeInterface } from "supertokens-node/recipe/thirdpartyemailpassword";

const thirdPartySignInUp = (
  originalImplementation: RecipeInterface,
  fastify: FastifyInstance
): RecipeInterface["thirdPartySignInUp"] => {
  const { config, log, slonik } = fastify;

  return async (input) => {
    const thirdPartyUser = await getUserByThirdPartyInfo(
      input.thirdPartyId,
      input.thirdPartyUserId,
      input.userContext
    );

    if (!thirdPartyUser && config.user.features?.signUp === false) {
      throw {
        name: "SIGN_UP_DISABLED",
        message: "SignUp feature is currently disabled",
        statusCode: 404,
      } as FastifyError;
    }

    const originalResponse = await originalImplementation.thirdPartySignInUp(
      input
    );

    if (originalResponse.status === "OK" && originalResponse.createdNewUser) {
      const rolesResponse = await UserRoles.addRoleToUser(
        originalResponse.user.id,
        config.user.role || "USER"
      );

      if (rolesResponse.status !== "OK") {
        log.error(rolesResponse.status);
      }
    }

    return originalResponse;
  };
};

export default thirdPartySignInUp;
