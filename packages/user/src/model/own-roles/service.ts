import { BaseService } from "@dzangolab/fastify-slonik";

import RoleSqlFactory from "./sqlFactory";
import { TABLE_ROLES } from "../../constants";
import CustomApiError from "../../customApiError";

import type { RolePermission, RoleWithPermissions } from "../../types/roles";
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
  static readonly TABLE = TABLE_ROLES;

  create = async (data: RoleCreateInput) => {
    const count = await this.count({
      key: "role",
      operator: "eq",
      value: data.role as string,
    });

    if (count != 0) {
      throw new CustomApiError({
        name: "ROLE_ALREADY_EXISTS",
        message: "Unable to create role as it already exists",
        statusCode: 422,
      });
    }

    const query = this.factory.getCreateSql({
      role: data.role,
      default: data.default,
    } as unknown as RoleCreateInput);

    const result = (await this.database.connect(async (connection) => {
      return connection.query(query).then((data) => {
        return data.rows[0];
      });
    })) as Role;

    const permissions = await this.addRolePermissions(
      result.id as number,
      data.permissions as string[]
    );

    return {
      ...result,
      permissions: permissions.map(
        (permission: RolePermission) => permission.permission
      ),
    };
  };

  addRolePermissions = async (roleId: number, permissions: string[]) => {
    const query = this.factory.getAddRolePermissionSql(roleId, permissions);

    const result = (await this.database.connect(async (connection) => {
      return connection.query(query).then((data) => {
        return data.rows;
      });
    })) as RolePermission[];

    return result;
  };

  getPermissionsForRole = async (id: number): Promise<RolePermission[]> => {
    const query = this.factory.getPermissionsForRoleSql(id);

    const result = await this.database.connect((connection) => {
      return connection.any(query);
    });

    return result as RolePermission[];
  };

  getRoles = async (): Promise<RoleWithPermissions[]> => {
    const query = this.factory.getRolesSql();

    const result = await this.database.connect((connection) => {
      return connection.any(query);
    });

    return result as RoleWithPermissions[];
  };

  removePermissionsFromRole = async (roleId: number, permissions: string[]) => {
    const query = this.factory.getRemovePermissionsSql(roleId, permissions);

    const result = await this.database.connect((connection) => {
      return connection.any(query);
    });

    return result;
  };

  updateRolePermissions = async (roleId: number, permissions: string[]) => {
    const response = await this.findById(roleId);

    if (!response) {
      throw new CustomApiError({
        name: "UNKNOWN_ROLE_ERROR",
        message: `Invalid role`,
        statusCode: 422,
      });
    }

    const rolePermissions = response.permissions as string[];

    const newPermissions = permissions.filter(
      (permission) => !rolePermissions.includes(permission)
    );

    const removedPermissions = rolePermissions.filter(
      (permission) => !permissions.includes(permission)
    );

    await this.removePermissionsFromRole(roleId, removedPermissions);
    await this.addRolePermissions(roleId, newPermissions);

    const permissionsResponse = await this.getPermissionsForRole(roleId);

    return permissionsResponse;
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
