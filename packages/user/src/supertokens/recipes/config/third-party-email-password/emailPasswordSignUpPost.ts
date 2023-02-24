import UserRoles from "supertokens-node/recipe/userroles";

import updateEmail from "../../../utils/updateEmail";

import type { User } from "../../../../types";
import type { FastifyInstance } from "fastify";
import type { APIInterface } from "supertokens-node/recipe/thirdpartyemailpassword/types";

const emailPasswordSignUpPOST = (
  originalImplementation: APIInterface,
  fastify: FastifyInstance
): typeof originalImplementation.emailPasswordSignUpPOST => {
  const { log } = fastify;

  return async (input) => {
    if (originalImplementation.emailPasswordSignUpPOST === undefined) {
      throw new Error("Should never come here");
    }

    const formFields = updateEmail.appendTenantId(
      input.formFields,
      input.options.req.original.tenant
    );

    input.formFields = formFields;

    const originalResponse =
      await originalImplementation.emailPasswordSignUpPOST(input);

    if (originalResponse.status === "OK") {
      const rolesResponse = await UserRoles.addRoleToUser(
        originalResponse.user.id,
        "USER"
      );

      if (rolesResponse.status !== "OK") {
        log.error(rolesResponse.status);
      }

      const { roles } = await UserRoles.getRolesForUser(
        originalResponse.user.id
      );

      const user: User = {
        ...originalResponse.user,
        email: updateEmail.removeTenantId(
          originalResponse.user.email,
          input.options.req.original.tenant
        ),
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
