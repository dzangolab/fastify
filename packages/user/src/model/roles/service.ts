import { BaseService } from "@dzangolab/fastify-slonik";
import UserRoles from "supertokens-node/recipe/userroles";

import RoleSqlFactory from "./sqlFactory";
import CustomApiError from "../../customApiError";

import type { Service } from "../../types/roles/service";
import type { QueryResultRow } from "slonik";

class RoleService<
    Role extends QueryResultRow,
    RoleCreateInput extends QueryResultRow,
    RoleUpdateInput extends QueryResultRow
  >
  extends BaseService<Role, RoleCreateInput, RoleUpdateInput>
  // eslint-disable-next-line prettier/prettier
  implements Service<Role, RoleCreateInput, RoleUpdateInput> {
  create = async (data: RoleCreateInput) => {
    const query = this.factory.getCreateSql({
      role: data.role,
    } as unknown as RoleCreateInput);

    const result = (await this.database.connect(async (connection) => {
      return connection.query(query).then((data) => {
        return data.rows[0];
      });
    })) as Role;

    await this.addRolePermissions(
      result.id as number,
      data.permissions as string[]
    );

    return result;
  };

  addRolePermissions = async (roleId: number, permissions: string[]) => {
    const query = this.factory.getAddRolePermissionSql(roleId, permissions);

    const result = (await this.database.connect(async (connection) => {
      return connection.query(query).then((data) => {
        return data.rows[0];
      });
    })) as Role;

    return result;
  };

  deleteRole = async (role: string): Promise<{ status: "OK" }> => {
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

    return { status: deleteRoleResponse.status };
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

  get factory() {
    if (!this.table) {
      throw new Error(`Service table is not defined`);
    }

    if (!this._factory) {
      this._factory = new RoleSqlFactory<
        Role,
        RoleCreateInput,
        RoleUpdateInput
      >(this);
    }

    return this._factory as RoleSqlFactory<
      Role,
      RoleCreateInput,
      RoleUpdateInput
    >;
  }
}

export default RoleService;
