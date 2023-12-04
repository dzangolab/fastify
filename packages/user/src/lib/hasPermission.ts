import { Error as STError } from "supertokens-node/recipe/session";
import UserRoles from "supertokens-node/recipe/userroles";

import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const hasPermission =
  (permission: string) =>
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  async (request: SessionRequest, reply: FastifyReply) => {
    const roles = await request.session?.getClaimValue(UserRoles.UserRoleClaim);

    if (roles && roles.includes("SUPER_ADMIN")) {
      return;
    }

    const permissions = await request.session?.getClaimValue(
      UserRoles.PermissionClaim
    );

    if (permissions === undefined || !permissions.includes(permission)) {
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
