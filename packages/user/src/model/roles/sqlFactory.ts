import {
  DefaultSqlFactory,
  createFilterFragment,
  createLimitFragment,
  createSortFragment,
  createTableIdentifier,
} from "@dzangolab/fastify-slonik";
import { sql } from "slonik";
import { z } from "zod";

import { TABLE_ROLE_PERMISSIONS, TABLE_USER_ROLES } from "../../constants";

import type {
  FilterInput,
  SortInput,
  SqlFactory,
} from "@dzangolab/fastify-slonik";
import type { QuerySqlToken, QueryResultRow } from "slonik";

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
  getListSql = (
    limit: number,
    offset?: number,
    filters?: FilterInput,
    sort?: SortInput[]
  ): QuerySqlToken => {
    const tableIdentifier = createTableIdentifier(this.table, this.schema);

    const rolePermissionsIdentifier = createTableIdentifier(
      TABLE_ROLE_PERMISSIONS,
      this.schema
    );

    return sql.type(this.validationSchema)`
      SELECT
        ${this.getTableFragment()}.*, 
        COALESCE(role_permissions.permissions, '[]') AS permissions
      FROM ${this.getTableFragment()}
      LEFT JOIN LATERAL (
        SELECT jsonb_agg(rp.permission) AS permissions
        FROM ${rolePermissionsIdentifier} as rp
        WHERE rp.role_id = ${this.getTableFragment()}.id
      ) AS role_permissions ON TRUE
      ${createFilterFragment(filters, tableIdentifier)}
      ${createSortFragment(tableIdentifier, this.getSortInput(sort))}
      ${createLimitFragment(limit, offset)};
    `;
  };

  getFindByIdSql = (id: number | string): QuerySqlToken => {
    const rolePermissionsIdentifier = createTableIdentifier(
      TABLE_ROLE_PERMISSIONS,
      this.schema
    );

    return sql.type(this.validationSchema)`
      SELECT
        ${this.getTableFragment()}.*, 
        COALESCE(role_permissions.permissions, '[]') AS permissions
      FROM ${this.getTableFragment()}
      LEFT JOIN LATERAL (
        SELECT jsonb_agg(rp.permission) AS permissions
        FROM ${rolePermissionsIdentifier} as rp
        WHERE rp.role_id = ${this.getTableFragment()}.id
      ) AS role_permissions ON TRUE
      WHERE id = ${id};
    `;
  };

  getIsRoleAssignedSql = (id: number | string) => {
    const userRolesTableIdentifier = createTableIdentifier(
      TABLE_USER_ROLES,
      this.schema
    );

    const schema = z.object({
      isRoleAssigned: z.boolean(),
    });

    return sql.type(schema)`
      SELECT EXISTS (
        SELECT *
        FROM ${userRolesTableIdentifier} 
        WHERE role_id = ${id}
      ) AS is_role_assigned;
    `;
  };

  getSetRolePermissionsSql = (
    roleId: string | number,
    permissions: string[]
  ) => {
    const rolePermissionsIdentifier = createTableIdentifier(
      TABLE_ROLE_PERMISSIONS,
      this.schema
    );

    if (permissions.length === 0) {
      return sql.unsafe`
        DELETE FROM ${rolePermissionsIdentifier}
        WHERE role_id = ${roleId};
      `;
    }

    return sql.unsafe`
      INSERT INTO ${rolePermissionsIdentifier} ("role_id", "permission")
      SELECT *
      FROM ${sql.unnest(
        permissions.map((permission) => {
          return [roleId, permission];
        }),
        ["int4", "varchar"]
      )} ON CONFLICT DO NOTHING;
    `;
  };
}

export default RoleSqlFactory;
