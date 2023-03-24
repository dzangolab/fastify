import UserRoles from "supertokens-node/recipe/userroles";

import type { User } from "../../../../types";
import type { FastifyInstance } from "fastify";
import type { APIInterface } from "supertokens-node/recipe/thirdpartyemailpassword/types";

const thirdPartySignInUpPOST = (
  originalImplementation: APIInterface,
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  fastify: FastifyInstance
): typeof originalImplementation.thirdPartySignInUpPOST => {
  return async (input) => {
    if (originalImplementation.thirdPartySignInUpPOST === undefined) {
      throw new Error("Should never come here");
    }

    const originalResponse =
      await originalImplementation.thirdPartySignInUpPOST(input);

    if (originalResponse.status === "OK" && originalResponse.createdNewUser) {
      const { roles } = await UserRoles.getRolesForUser(
        originalResponse.user.id
      );

      const user: User = {
        ...originalResponse.user,
        /* eslint-disable-next-line unicorn/no-null */
        profile: null,
        roles,
      };

      return {
        status: "OK",
        createdNewUser: originalResponse.createdNewUser,
        user,
        session: originalResponse.session,
        authCodeResponse: originalResponse.authCodeResponse,
      };
    }

    return originalResponse;
  };
};

export default thirdPartySignInUpPOST;
