import { Error as STError } from "supertokens-node/recipe/session";
import UserRoles from "supertokens-node/recipe/userroles";

import { ROLE_SUPER_ADMIN } from "../constants";

import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const getPermissions = async (roles: string[]) => {
  let permissions: string[] = [];

  for (const role of roles) {
    const response = await UserRoles.getPermissionsForRole(role);

    if (response.status === "OK") {
      permissions = [...new Set([...permissions, ...response.permissions])];
    }
  }

  return permissions;
};

const hasPermission =
  (permission: string) =>
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  async (request: SessionRequest, reply: FastifyReply) => {
    const userId = request.session?.getUserId();

    if (!userId) {
      throw new STError({
        type: "UNAUTHORISED",
        message: "unauthorised",
      });
    }

    const { roles } = await UserRoles.getRolesForUser(userId);

    if (roles && roles.includes(ROLE_SUPER_ADMIN)) {
      return;
    }

    const permissions = await getPermissions(roles);

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
