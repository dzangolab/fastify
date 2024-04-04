import {
  DefaultSqlFactory,
  createLimitFragment,
  createFilterFragment,
  createTableIdentifier,
} from "@dzangolab/fastify-slonik";
import humps from "humps";
import { QueryResultRow, QuerySqlToken, sql } from "slonik";
import * as zod from "zod";

import { createSortFragment, createSortRoleFragment } from "./sql";
import { TABLE_ROLE_PERMISSIONS } from "../../constants";

import type { Service } from "../../types/roles/service";
import type { SqlFactory } from "../../types/roles/sqlFactory";
import type { FilterInput, SortInput } from "@dzangolab/fastify-slonik";

/* eslint-disable brace-style */
class RoleSqlFactory<
    Role extends QueryResultRow,
    RoleCreateInput extends QueryResultRow,
    RoleUpdateInput extends QueryResultRow
  >
  extends DefaultSqlFactory<Role, RoleCreateInput, RoleUpdateInput>
  implements SqlFactory<Role, RoleCreateInput, RoleUpdateInput>
{
  /* eslint-enabled */
  protected declare _service: Service<Role, RoleCreateInput, RoleUpdateInput>;

  getAddRolePermissionSql = (
    roleId: number,
    permissions: string[]
  ): QuerySqlToken => {
    const permissionsTable = createTableIdentifier(
      TABLE_ROLE_PERMISSIONS,
      this.schema
    );

    return sql.type(this.validationSchema)`
      INSERT INTO ${permissionsTable} ("role_id", "permission")
      SELECT *
      FROM ${sql.unnest(
        [permissions.map((permission) => [roleId, permission])],
        ["integer", "varchar"]
      )}
      RETURNING *;
    `;
  };

  getPermissionsForRoleSql = (id: number): QuerySqlToken => {
    const permissionsIdentifier = createTableIdentifier(
      TABLE_ROLE_PERMISSIONS,
      this.schema
    );

    const filters: FilterInput = {
      key: "rowId",
      operator: "eq",
      value: `${id}`,
    };

    return sql.unsafe`
      SELECT *
      FROM ${permissionsIdentifier}
      ${createFilterFragment(filters, permissionsIdentifier)};

    `;
  };

  getAllRolesWithPermissions = (): QuerySqlToken => {
    const rolePermissionsIdentifier = createTableIdentifier(
      TABLE_ROLE_PERMISSIONS,
      this.schema
    );

    return sql.unsafe`
      SELECT
        ${this.getTableFragment()}.*,
        COALESCE(user_permissions.permission, '[]') AS permissions
      FROM ${this.getTableFragment()}
      LEFT JOIN LATERAL (
        SELECT jsonb_agg(rp.permission) AS permissions
        FROM ${rolePermissionsIdentifier} as rp
        WHERE rp.role_id = ${this.getTableFragment()}.id
      ) AS role_permissions ON TRUE
    `;
  };

  get service() {
    return this._service;
  }
}

export default RoleSqlFactory;
