import { wrapResponse } from "supertokens-node/framework/fastify";
import Session from "supertokens-node/recipe/session";
import SuperTokens from "supertokens-node/recipe/thirdpartyemailpassword";
import UserRoles from "supertokens-node/recipe/userroles";

import UserProfileService from "./model/user-profiles/service";

import type {
  UserProfile,
  User,
  UserProfileCreateInput,
  UserProfileUpdateInput,
} from "./types";
import type { ApiConfig } from "@dzangolab/fastify-config";
import type { Database } from "@dzangolab/fastify-slonik";
import type { FastifyRequest, FastifyReply } from "fastify";
import type { QueryResultRow, SqlTaggedTemplate } from "slonik";

const buildAuthContext = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const context = {
    config: request.config as ApiConfig,
    database: request.slonik as Database,
    sql: request.sql as SqlTaggedTemplate,
    user: undefined as User | undefined,
  };
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

    if (!supertokensUser) {
      return context;
    }

    /* eslint-disable-next-line unicorn/no-null */
    let profile: UserProfile | null = null;

    try {
      profile = await service.findById(userId);
    } catch {
      // FIXME [OP 2022-AUG-22] Handle error properly
      // DataIntegrityError
    }

    const { roles } = await UserRoles.getRolesForUser(userId);

    const user: User = {
      ...supertokensUser,
      profile,
      roles,
    };

    context.user = user;
  }

  return context;
};

export default buildAuthContext;
