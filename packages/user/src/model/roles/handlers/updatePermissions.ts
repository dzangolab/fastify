import UserRoles from "supertokens-node/recipe/userroles";

import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const updatePermissions = async (
  request: SessionRequest,
  reply: FastifyReply
) => {
  const { log, body } = request;

  try {
    const { role, permissions } = body as {
      role: string;
      permissions: string[];
    };

    const response = await UserRoles.getPermissionsForRole(role);

    if (response.status === "OK") {
      const rolePermissions = response.permissions;

      const newPermissions = permissions.filter(
        (permission) => !rolePermissions.includes(permission)
      );

      const removedPermissions = rolePermissions.filter(
        (permission) => !permissions.includes(permission)
      );

      await UserRoles.createNewRoleOrAddPermissions(role, newPermissions);
      await UserRoles.removePermissionsFromRole(role, removedPermissions);

      const updatedPermissions = [...rolePermissions, ...newPermissions]
        .filter((permission) => !removedPermissions.includes(permission))
        .sort();

      return reply.send({ permissions: updatedPermissions });
    }

    // FIXME throw error with proper error message.
    throw new Error("UNKNOWN_ROLE_ERROR");
  } catch (error) {
    log.error(error);
    reply.status(500);

    return reply.send({
      status: "ERROR",
      message: "Oops! Something went wrong",
    });
  }
};

export default updatePermissions;
