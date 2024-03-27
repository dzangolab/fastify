import UserRoles from "supertokens-node/recipe/userroles";

import CustomApiError from "../../customApiError";

class RoleService {
  createRole = async (role: string, permissions?: string[]) => {
    const { roles } = await UserRoles.getAllRoles(role);

    if (roles.includes(role)) {
      throw new CustomApiError({
        name: "ROLE_ALREADY_EXISTS",
        message: "Unable to create role as it already exists",
        statusCode: 422,
      });
    }

    const createRoleResponse = await UserRoles.createNewRoleOrAddPermissions(
      role,
      permissions || []
    );

    return createRoleResponse;
  };

  deleteRole = async (
    role: string
  ): Promise<{ status: "OK"; didRoleExist: boolean }> => {
    const response = await UserRoles.getUsersThatHaveRole(role);

    if (response.status === "UNKNOWN_ROLE_ERROR") {
      throw new CustomApiError({
        name: response.status,
        message: `Invalid role`,
        statusCode: 422,
      });
    }

    if (response.users.length > 0) {
      throw new CustomApiError({
        name: "ROLE_IN_USE",
        message:
          "The role is currently assigned to one or more users and cannot be deleted",
        statusCode: 422,
      });
    }

    const deleteRoleResponse = await UserRoles.deleteRole(role);

    return deleteRoleResponse;
  };

  getPermissionsForRole = async (role: string): Promise<string[]> => {
    let permissions: string[] = [];

    const response = await UserRoles.getPermissionsForRole(role);

    if (response.status === "OK") {
      permissions = response.permissions;
    }

    return permissions;
  };

  getRoles = async (): Promise<{ role: string; permissions: string[] }[]> => {
    let roles: { role: string; permissions: string[] }[] = [];

    const response = await UserRoles.getAllRoles();

    if (response.status === "OK") {
      // [DU 2024-MAR-20] This is N+1 problem
      roles = await Promise.all(
        response.roles.map(async (role) => {
          const response = await UserRoles.getPermissionsForRole(role);

          return {
            role,
            permissions: response.status === "OK" ? response.permissions : [],
          };
        })
      );
    }

    return roles;
  };

  updateRolePermissions = async (
    role: string,
    permissions: string[]
  ): Promise<{ status: "OK"; permissions: string[] }> => {
    const response = await UserRoles.getPermissionsForRole(role);

    if (response.status === "UNKNOWN_ROLE_ERROR") {
      throw new CustomApiError({
        name: "UNKNOWN_ROLE_ERROR",
        message: `Invalid role`,
        statusCode: 422,
      });
    }

    const rolePermissions = response.permissions;

    const newPermissions = permissions.filter(
      (permission) => !rolePermissions.includes(permission)
    );

    const removedPermissions = rolePermissions.filter(
      (permission) => !permissions.includes(permission)
    );

    await UserRoles.removePermissionsFromRole(role, removedPermissions);
    await UserRoles.createNewRoleOrAddPermissions(role, newPermissions);

    const permissionsResponse = await this.getPermissionsForRole(role);

    return {
      status: "OK",
      permissions: permissionsResponse,
    };
  };
}

export default RoleService;
