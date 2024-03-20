import UserRoles from "supertokens-node/recipe/userroles";

class RoleService {
  createRole = async (role: string, permissions?: string[]) => {
    return await UserRoles.createNewRoleOrAddPermissions(
      role,
      permissions || []
    );
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
  ): Promise<string[]> => {
    const response = await UserRoles.getPermissionsForRole(role);

    if (response.status === "UNKNOWN_ROLE_ERROR") {
      throw new Error("UNKNOWN_ROLE_ERROR");
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

    return this.getPermissionsForRole(role);
  };
}

export default RoleService;
