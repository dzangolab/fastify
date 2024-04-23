import { BaseService } from "@dzangolab/fastify-slonik";

import RoleSqlFactory from "./sqlFactory";
import { TABLE_ROLES } from "../../constants";
import CustomApiError from "../../customApiError";
import { roleSchema } from "../../schemas";

import type {
  FilterInput,
  Service,
  SortInput,
} from "@dzangolab/fastify-slonik";
import type { QueryResultRow } from "slonik";

/* eslint-disable brace-style */
class RoleService<
    Role extends QueryResultRow,
    RoleCreateInput extends QueryResultRow,
    RoleUpdateInput extends QueryResultRow
  >
  extends BaseService<Role, RoleCreateInput, RoleUpdateInput>
  implements Service<Role, RoleCreateInput, RoleUpdateInput>
{
  /* eslint-enabled */
  static readonly TABLE = TABLE_ROLES;

  protected _validationSchema = roleSchema;

  all = async (
    fields: string[],
    sort?: SortInput[],
    filterInput?: FilterInput
  ): Promise<Partial<readonly Role[]>> => {
    const query = this.factory.getAllSql(fields, sort, filterInput);

    const result = await this.database.connect((connection) => {
      return connection.any(query);
    });

    return result as Partial<readonly Role[]>;
  };

  create = async (data: RoleCreateInput) => {
    const { permissions, ...dataInput } = data;

    const roleCount = await this.count({
      key: "role",
      operator: "eq",
      value: data.role as string,
    });

    if (roleCount !== 0) {
      throw new CustomApiError({
        name: "ROLE_ALREADY_EXISTS",
        message: "Unable to create role as it already exists",
        statusCode: 422,
      });
    }

    const query = this.factory.getCreateSql(dataInput as RoleCreateInput);

    const result = (await this.database.connect(async (connection) => {
      return connection.query(query).then((data) => {
        return data.rows[0];
      });
    })) as Role;

    if (permissions) {
      try {
        await this.setRolePermissions(
          result.id as number,
          permissions as string[]
        );
      } catch (error) {
        await this.delete(result.id as number);

        throw error;
      }
    }

    return {
      ...result,
      permissions,
    };
  };

  delete = async (id: number | string): Promise<Role | null> => {
    const role = await this.findById(id);

    if (!role) {
      throw new CustomApiError({
        name: "UNKNOWN_ROLE_ERROR",
        message: `Invalid role`,
        statusCode: 422,
      });
    }

    const isRoleAssigned = await this.isRoleAssigned(id);

    if (isRoleAssigned) {
      throw new CustomApiError({
        name: "ROLE_IN_USE",
        message:
          "The role is currently assigned to one or more users and cannot be deleted",
        statusCode: 422,
      });
    }

    const query = this.factory.getDeleteSql(id);

    await this.database.connect((connection) => {
      return connection.one(query);
    });

    return role;
  };

  isRoleAssigned = async (id: number | string): Promise<boolean> => {
    const query = this.factory.getIsRoleAssignedSql(id);

    const result = await this.database.connect((connection) => {
      return connection.one(query).then((columns) => columns.isRoleAssigned);
    });

    return result as boolean;
  };

  setRolePermissions = async (
    roleId: string | number,
    permissions: string[]
  ) => {
    const query = this.factory.getSetRolePermissionsSql(roleId, permissions);

    await this.database.connect((connection) => {
      return connection.any(query);
    });

    return { roleId, permissions };
  };

  update = async (
    id: number | string,
    data: RoleUpdateInput
  ): Promise<Role> => {
    const { permissions, ...dataInput } = data;

    const role = await this.findById(id);

    if (!role) {
      throw new CustomApiError({
        name: "UNKNOWN_ROLE_ERROR",
        message: `Invalid role`,
        statusCode: 422,
      });
    }

    const result = await this.database.connect(async (connection) => {
      return connection.transaction(async (transactionConnection) => {
        await transactionConnection.query(
          this.factory.getUpdateSql(id, dataInput as RoleUpdateInput)
        );

        if (permissions) {
          await transactionConnection.query(
            this.factory.getSetRolePermissionsSql(id, [])
          );

          await transactionConnection.query(
            this.factory.getSetRolePermissionsSql(id, permissions as string[])
          );
        }

        return await transactionConnection.query(
          this.factory.getFindByIdSql(id)
        );
      });
    });

    return result.rows[0] as Role;
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
