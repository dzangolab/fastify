import UserRoles from "supertokens-node/recipe/userroles";

import type { User } from "../../../../types";
import type { FastifyInstance } from "fastify";
import type { APIInterface } from "supertokens-node/recipe/thirdpartyemailpassword/types";

const emailPasswordSignUpPOST = (
  originalImplementation: APIInterface,
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  fastify: FastifyInstance
): APIInterface["emailPasswordSignUpPOST"] => {
  return async (input) => {
    input.userContext.tenant = input.options.req.original.tenant;

    if (originalImplementation.emailPasswordSignUpPOST === undefined) {
      throw new Error("Should never come here");
    }

    const originalResponse =
      await originalImplementation.emailPasswordSignUpPOST(input);

    if (originalResponse.status === "OK") {
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
        user,
        session: originalResponse.session,
      };
    }

    return originalResponse;
  };
};

export default emailPasswordSignUpPOST;
