import UserRoles from "supertokens-node/recipe/userroles";

import updateFields from "../../../utils/updateFields";
import updateTenantUser from "../../../utils/updateTenantUser";

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

    const formFields = updateFields(
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
        /* eslint-disable-next-line unicorn/no-null */
        profile: null,
        roles,
      };

      return {
        status: "OK",
        user: updateTenantUser(user, input.options.req.original.tenant),
        session: originalResponse.session,
      };
    }

    return originalResponse;
  };
};

export default emailPasswordSignUpPOST;
