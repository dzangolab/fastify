import getRolesByNames from "./getRolesByNames";
import getUserService from "./getUserService";
import { ROLE_SUPERADMIN } from "../constants";

import type { Role, User } from "../types";
import type { FastifyInstance } from "fastify";

const getPermissions = async (fastify: FastifyInstance, roles: Role[]) => {
  const rolesWithPermissions = (await getRolesByNames(
    roles.map(({ role }) => role),
    fastify.config,
    fastify.slonik
  )) as Required<Role>[];

  return rolesWithPermissions.flatMap((role) => role.permissions);
};

const hasUserPermission = async (
  fastify: FastifyInstance,
  userId: string,
  permission: string
): Promise<boolean> => {
  const permissions = fastify.config.user.permissions;

  // Allow if provided permission is not defined
  if (!permissions || !permissions.includes(permission)) {
    return true;
  }

  const userService = getUserService(fastify.config, fastify.slonik);

  const { roles } = (await userService.findById(userId)) as User;

  // Allow if user has super admin role
  if (roles && roles.some(({ role }) => role === ROLE_SUPERADMIN)) {
    return true;
  }

  const rolePermissions = await getPermissions(fastify, roles);

  if (!rolePermissions || !rolePermissions.includes(permission)) {
    return false;
  }

  return true;
};

export default hasUserPermission;
