import { wrapResponse } from "supertokens-node/framework/fastify";
import Session from "supertokens-node/recipe/session";
import SuperTokens from "supertokens-node/recipe/thirdpartyemailpassword";
import UserRoles from "supertokens-node/recipe/userroles";

import UserProfileService from "./model/user-profiles/service";

import type {
  UserProfile,
  UserProfileCreateInput,
  UserProfileUpdateInput,
} from "./types";
import type { FastifyRequest, FastifyReply } from "fastify";
import type { MercuriusContext } from "mercurius";
import type { QueryResultRow } from "slonik";

const userContext = async (
  context: MercuriusContext,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { config, slonik } = request;

  const session = await Session.getSession(request, wrapResponse(reply), {
    sessionRequired: false,
  });

  const userId = session?.getUserId();

  if (userId) {
    const service: UserProfileService<
      UserProfile & QueryResultRow,
      UserProfileCreateInput,
      UserProfileUpdateInput
    > = new UserProfileService(config, slonik);

    const supertokensUser = await SuperTokens.getUserById(userId);

    if (supertokensUser) {
      /* eslint-disable-next-line unicorn/no-null */
      let profile: UserProfile | null = null;

      const { roles } = await UserRoles.getRolesForUser(userId);

      try {
        profile = await service.findById(userId);
      } catch {
        // FIXME [OP 2022-AUG-22] Handle error properly
        // DataIntegrityError
      }

      const user = {
        ...supertokensUser,
        profile,
        roles,
      };

      context.user = user;
    }
  }
};

export default userContext;
