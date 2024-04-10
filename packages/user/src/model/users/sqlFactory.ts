import {
  DefaultSqlFactory,
  createLimitFragment,
  createFilterFragment,
  createTableIdentifier,
} from "@dzangolab/fastify-slonik";
import humps from "humps";
import { QueryResultRow, QuerySqlToken, sql } from "slonik";

import { createSortFragment, createSortRoleFragment } from "./sql";
import { TABLE_USER_ROLES } from "../../constants";

import type {
  SqlFactory,
  FilterInput,
  SortInput,
} from "@dzangolab/fastify-slonik";

/* eslint-disable brace-style */
class UserSqlFactory<
    User extends QueryResultRow,
    UserCreateInput extends QueryResultRow,
    UserUpdateInput extends QueryResultRow
  >
  extends DefaultSqlFactory<User, UserCreateInput, UserUpdateInput>
  implements SqlFactory<User, UserCreateInput, UserUpdateInput>
{
  /* eslint-enabled */
  getAddRolesToUserSql = (
    id: number | string,
    roleIds: number[]
  ): QuerySqlToken => {
    const userRolesTableIdentifier = createTableIdentifier(
      TABLE_USER_ROLES,
      this.schema
    );

    return sql.unsafe`
      INSERT INTO ${userRolesTableIdentifier} ("user_id", "role_id")
      SELECT *
      FROM ${sql.unnest(
        roleIds.map((roleId) => {
          return [id, roleId];
        }),
        ["varchar", "int4"]
      )} ON CONFLICT DO NOTHING
      return
        ${this.getTableFragment()}.*,
        COALESCE(user_role.role, '[]') AS roles
      FROM ${this.getTableFragment()}
      LEFT JOIN LATERAL (
        SELECT jsonb_agg(r ${createSortRoleFragment(
          sql.identifier(["r", "id"])
        )}) AS role
        FROM "public"."user_roles" as ur
        JOIN roles r ON ur.role_id = r.id
        WHERE ur.user_id = users.id
      ) AS user_role ON TRUE
      WHERE id = ${id};
    `;
  };

  getFindByIdSql = (id: number | string): QuerySqlToken => {
    return sql.type(this.validationSchema)`
      SELECT
        ${this.getTableFragment()}.*,
        COALESCE(user_role.role, '[]') AS roles
      FROM ${this.getTableFragment()}
      LEFT JOIN LATERAL (
        SELECT jsonb_agg(r ${createSortRoleFragment(
          sql.identifier(["r", "id"])
        )}) AS role
        FROM "public"."user_roles" as ur
        JOIN roles r ON ur.role_id = r.id
        WHERE ur.user_id = users.id
      ) AS user_role ON TRUE
      WHERE id = ${id};
    `;
  };

  getListSql = (
    limit: number,
    offset?: number,
    filters?: FilterInput,
    sort?: SortInput[]
  ): QuerySqlToken => {
    const tableIdentifier = createTableIdentifier(this.table, this.schema);

    return sql.type(this.validationSchema)`
      SELECT
        ${this.getTableFragment()}.*,
        COALESCE(user_role.role, '[]') AS roles
      FROM ${this.getTableFragment()}
      LEFT JOIN LATERAL (
        SELECT jsonb_agg(r ${createSortRoleFragment(
          sql.identifier(["r", "id"]),
          sort
        )}) AS role
        FROM "public"."user_roles" as ur
        JOIN roles r ON ur.role_id = r.id
        WHERE ur.user_id = users.id
      ) AS user_role ON TRUE
      ${createFilterFragment(filters, tableIdentifier)}
      ${createSortFragment(tableIdentifier, this.getSortInput(sort))}
      ${createLimitFragment(limit, offset)};
    `;
  };

  getUpdateSql = (
    id: number | string,
    data: UserUpdateInput
  ): QuerySqlToken => {
    const columns = [];

    for (const column in data) {
      const value = data[column as keyof UserUpdateInput];
      columns.push(
        sql.fragment`${sql.identifier([humps.decamelize(column)])} = ${value}`
      );
    }

    return sql.type(this.validationSchema)`
      UPDATE ${this.getTableFragment()}
      SET ${sql.join(columns, sql.fragment`, `)}
      WHERE id = ${id}
      RETURNING *, (
        SELECT COALESCE(user_role.role, '[]') AS roles
        FROM ${this.getTableFragment()}
        LEFT JOIN LATERAL (
          SELECT jsonb_agg(r ${createSortRoleFragment(
            sql.identifier(["r", "id"])
          )}) AS role
          FROM "public"."user_roles" as ur
          JOIN roles r ON ur.role_id = r.id
          WHERE ur.user_id = users.id
        ) AS user_role ON TRUE
        WHERE id = ${id}
      ) as roles;
    `;
  };
}

export default UserSqlFactory;
