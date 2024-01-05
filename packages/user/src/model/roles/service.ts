import UserRoles from "supertokens-node/recipe/userroles";

class RoleService {
  createRole = async (role: string) => {
    await UserRoles.createNewRoleOrAddPermissions(role, []);
  };

  getPermissionsForRole = async (role: string): Promise<string[]> => {
    let permissions: string[] = [];

    const response = await UserRoles.getPermissionsForRole(role);

    if (response.status === "OK") {
      permissions = response.permissions;
    }

    return permissions;
  };

  getRoles = async (): Promise<string[]> => {
    let roles: string[] = [];

    const response = await UserRoles.getAllRoles();

    if (response.status === "OK") {
      roles = response.roles;
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
