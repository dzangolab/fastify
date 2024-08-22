import {
  DefaultSqlFactory,
  createFilterFragment,
  createLimitFragment,
  createSortFragment,
  createTableIdentifier,
} from "@dzangolab/fastify-slonik";
import humps from "humps";
import { sql } from "slonik";
import { z } from "zod";

import { TABLE_PERMISSIONS, TABLE_ROLE_PERMISSIONS } from "../../constants";

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
  getAllSql = (
    fields: string[],
    sort?: SortInput[],
    filters?: FilterInput
  ): QuerySqlToken => {
    const identifiers = [];

    const fieldsObject: Record<string, true> = {};

    for (const field of fields) {
      if (field != "permissions") {
        identifiers.push(sql.identifier([humps.decamelize(field)]));
        fieldsObject[humps.camelize(field)] = true;
      }
    }

    const tableIdentifier = createTableIdentifier(this.table, this.schema);
    const rolePermissionsIdentifier = createTableIdentifier(
      TABLE_ROLE_PERMISSIONS,
      this.schema
    );
    const permissionIdentifier = createTableIdentifier(
      TABLE_PERMISSIONS,
      this.schema
    );

    const permissionsFragment = fields.includes("permissions")
      ? sql.fragment`,
        COALESCE(role_permissions.permissions, '[]') AS permissions
      `
      : sql.fragment``;

    const allSchema =
      this.validationSchema._def.typeName === "ZodObject"
        ? (this.validationSchema as z.AnyZodObject).pick(fieldsObject)
        : z.any();

    return sql.type(allSchema)`
      SELECT
        ${sql.join(identifiers, sql.fragment`, `)}
        ${permissionsFragment}
      FROM ${this.getTableFragment()}
      LEFT JOIN LATERAL (
        SELECT jsonb_agg(row_to_json(p)) AS permissions
        FROM ${rolePermissionsIdentifier} as rp
        JOIN ${permissionIdentifier} as p ON p.id = rp.permission_id
        WHERE rp.role_id = ${this.getTableFragment()}.id
      ) AS role_permissions ON TRUE
      ${createFilterFragment(filters, tableIdentifier)}
      ${createSortFragment(tableIdentifier, this.getSortInput(sort))}
    `;
  };

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

    const permissionIdentifier = createTableIdentifier(
      TABLE_PERMISSIONS,
      this.schema
    );

    return sql.type(this.validationSchema)`
      SELECT
        ${this.getTableFragment()}.*, 
        COALESCE(role_permissions.permissions, '[]') AS permissions
      FROM ${this.getTableFragment()}
      LEFT JOIN LATERAL (
        SELECT jsonb_agg(row_to_json(p)) AS permissions
        FROM ${rolePermissionsIdentifier} as rp
        JOIN ${permissionIdentifier} as p ON p.id = rp.permission_id
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

    const permissionIdentifier = createTableIdentifier(
      TABLE_PERMISSIONS,
      this.schema
    );

    return sql.type(this.validationSchema)`
      SELECT
        ${this.getTableFragment()}.*, 
        COALESCE(role_permissions.permissions, '[]') AS permissions
      FROM ${this.getTableFragment()}
      LEFT JOIN LATERAL (
        SELECT jsonb_agg(row_to_json(p)) AS permissions
        FROM ${rolePermissionsIdentifier} as rp
        JOIN ${permissionIdentifier} as p ON p.id = rp.permission_id
        WHERE rp.role_id = ${this.getTableFragment()}.id
      ) AS role_permissions ON TRUE
      WHERE id = ${id};
    `;
  };

  getSetRolePermissionsSql = (
    roleId: string | number,
    permissionIds: number[]
  ) => {
    const rolePermissionsIdentifier = createTableIdentifier(
      TABLE_ROLE_PERMISSIONS,
      this.schema
    );

    if (permissionIds.length === 0) {
      return sql.unsafe`
        DELETE FROM ${rolePermissionsIdentifier}
        WHERE role_id = ${roleId};
      `;
    }

    return sql.unsafe`
      INSERT INTO ${rolePermissionsIdentifier} ("role_id", "permission_id")
      SELECT *
      FROM ${sql.unnest(
        permissionIds.map((permissionId) => {
          return [roleId, permissionId];
        }),
        ["int4", "int4"]
      )} ON CONFLICT DO NOTHING;
    `;
  };
}

export default RoleSqlFactory;
