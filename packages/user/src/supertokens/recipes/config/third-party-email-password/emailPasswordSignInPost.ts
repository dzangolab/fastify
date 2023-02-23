import updateEmail from "../../../utils/updateEmail";

import type { FastifyInstance } from "fastify";
import type { APIInterface } from "supertokens-node/recipe/thirdpartyemailpassword/types";

const emailPasswordSignInPOST = (
  originalImplementation: APIInterface,
  fastify: FastifyInstance
): typeof originalImplementation.emailPasswordSignInPOST => {
  return async (input) => {
    if (originalImplementation.emailPasswordSignInPOST === undefined) {
      throw new Error("Should never come here");
    }

    const origin = input.options.req.getHeaderValue("origin") as string;

    const formFields = await updateEmail(fastify, origin, input.formFields);

    input.formFields = formFields;

    const originalResponse =
      await originalImplementation.emailPasswordSignInPOST(input);

    // if (originalResponse.status === "OK") {
    //   const rolesResponse = await UserRoles.addRoleToUser(
    //     originalResponse.user.id,
    //     "USER"
    //   );

    //   if (rolesResponse.status !== "OK") {
    //     log.error(rolesResponse.status);
    //   }

    //   const { roles } = await UserRoles.getRolesForUser(
    //     originalResponse.user.id
    //   );

    //   const user: User = {
    //     ...originalResponse.user,
    //     /* eslint-disable-next-line unicorn/no-null */
    //     profile: null,
    //     roles,
    //   };

    //   return {
    //     status: "OK",
    //     user,
    //     session: originalResponse.session,
    //   };
    // }

    return originalResponse;
  };
};

export default emailPasswordSignInPOST;
