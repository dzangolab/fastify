import {
  DefaultSqlFactory,
  createLimitFragment,
  createFilterFragment,
  createTableIdentifier,
} from "@dzangolab/fastify-slonik";
import { QueryResultRow, QuerySqlToken, sql } from "slonik";

import { createSortRoleFragment, createSortFragment } from "./sql";

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
        SELECT json_agg(ur.role ${createSortRoleFragment(
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
        SELECT json_agg(ur.role ${createSortRoleFragment(
          sql.identifier(["ur", "role"]),
          sort
        )}) AS role
        FROM "public"."st__user_roles" as ur
        WHERE ur.user_id = users.id
      ) AS user_role ON TRUE
      ${createFilterFragment(filters, tableIdentifier)}
      ${createSortFragment(tableIdentifier, this.getSortInput(sort))}
      ${createLimitFragment(limit, offset)};
    `;
  };
}

export default UserSqlFactory;
