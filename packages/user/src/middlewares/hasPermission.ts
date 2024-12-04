import { Error as STError } from "supertokens-node/recipe/session";
import UserRoles from "supertokens-node/recipe/userroles";

import hasUserPermission from "../lib/hasUserPermission";

import type { SessionRequest } from "supertokens-node/framework/fastify";

const hasPermission =
  (permission: string) =>
  async (request: SessionRequest): Promise<void> => {
    const user = request.user;

    if (!user) {
      throw new STError({
        type: "UNAUTHORISED",
        message: "unauthorised",
      });
    }

    if (!(await hasUserPermission(request.server, user.id, permission))) {
      // this error tells SuperTokens to return a 403 http response.
      throw new STError({
        type: "INVALID_CLAIMS",
        message: "Not have enough permission",
        payload: [
          {
            id: UserRoles.PermissionClaim.key,
            reason: {
              message: "Not have enough permission",
              expectedToInclude: permission,
            },
          },
        ],
      });
    }
  };

export default hasPermission;
