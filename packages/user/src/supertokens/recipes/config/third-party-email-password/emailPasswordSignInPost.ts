import UserRoles from "supertokens-node/recipe/userroles";

import UserProfileService from "../../../../model/user-profiles/service";
import updateEmail from "../../../utils/updateEmail";
import updateTenantUser from "../../../utils/updateTenantUser";

import type {
  User,
  UserProfile,
  UserProfileCreateInput,
  UserProfileUpdateInput,
} from "../../../../types";
import type { FastifyInstance } from "fastify";
import type { QueryResultRow } from "slonik";
import type { APIInterface } from "supertokens-node/recipe/thirdpartyemailpassword/types";

const emailPasswordSignInPOST = (
  originalImplementation: APIInterface,
  fastify: FastifyInstance
): typeof originalImplementation.emailPasswordSignInPOST => {
  return async (input) => {
    const { config, slonik } = fastify;

    if (originalImplementation.emailPasswordSignInPOST === undefined) {
      throw new Error("Should never come here");
    }

    const formFields = updateEmail.appendTenantId(
      input.formFields,
      input.options.req.original.tenant
    );

    input.formFields = formFields;

    const originalResponse =
      await originalImplementation.emailPasswordSignInPOST(input);

    if (originalResponse.status !== "OK") {
      return originalResponse;
    }

    const service: UserProfileService<
      UserProfile & QueryResultRow,
      UserProfileCreateInput,
      UserProfileUpdateInput
    > = new UserProfileService(config, slonik);

    /* eslint-disable-next-line unicorn/no-null */
    let profile: UserProfile | null = null;

    try {
      profile = await service.findById(originalResponse.user.id);
    } catch {
      // FIXME [OP 2022-AUG-22] Handle error properly
      // DataIntegrityError
    }

    const { roles } = await UserRoles.getRolesForUser(originalResponse.user.id);

    const user: User = {
      ...originalResponse.user,
      profile,
      roles,
    };

    return {
      status: "OK",
      user: updateTenantUser(user, input.options.req.original.tenant),
      session: originalResponse.session,
    };
  };
};

export default emailPasswordSignInPOST;
