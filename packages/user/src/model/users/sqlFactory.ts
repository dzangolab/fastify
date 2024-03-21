import {
  DefaultSqlFactory,
  createLimitFragment,
  createTableIdentifier,
  createWhereFragment,
} from "@dzangolab/fastify-slonik";
import humps from "humps";
import { QueryResultRow, QuerySqlToken, sql } from "slonik";

import { createSortFragment, createSortRoleFragment } from "./sql";

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

  getFindByIdSql = (id: number | string): QuerySqlToken => {
    return sql.type(this.validationSchema)`
      SELECT
        ${this.getTableFragment()}.*,
        COALESCE(user_role.role, '[]') AS roles
      FROM ${this.getTableFragment()}
      LEFT JOIN LATERAL (
        SELECT jsonb_agg(ur.role ${createSortRoleFragment(
          sql.identifier(["ur", "role"])
        )}) AS role
        FROM "public"."st__user_roles" as ur
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
        SELECT jsonb_agg(ur.role ${createSortRoleFragment(
          sql.identifier(["ur", "role"]),
          sort
        )}) AS role
        FROM "public"."st__user_roles" as ur
        WHERE ur.user_id = users.id
      ) AS user_role ON TRUE
      ${createWhereFragment(filters, tableIdentifier)}
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
          SELECT jsonb_agg(ur.role ${createSortRoleFragment(
            sql.identifier(["ur", "role"])
          )}) AS role
          FROM "public"."st__user_roles" as ur
          WHERE ur.user_id = users.id
        ) AS user_role ON TRUE
        WHERE id = ${id}
      ) as roles;
    `;
  };
}

export default UserSqlFactory;
