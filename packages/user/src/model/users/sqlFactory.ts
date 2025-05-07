import { DefaultSqlFactory } from "@dzangolab/fastify-slonik";
import humps from "humps";
import { QuerySqlToken, sql } from "slonik";

import { createSortRoleFragment } from "./sql";
import { TABLE_USERS } from "../../constants";
import { ChangeEmailInput, UserUpdateInput } from "../../types";

import type { FilterInput, SortInput } from "@dzangolab/fastify-slonik";

class UserSqlFactory extends DefaultSqlFactory {
  static readonly TABLE = TABLE_USERS;

  protected _softDeleteEnabled: boolean = true;

  getFindByIdSql = (id: number | string): QuerySqlToken => {
    return sql.type(this.validationSchema)`
      SELECT
        ${this.getTableFragment()}.*,
        COALESCE(user_role.role, '[]') AS roles
      FROM ${this.getTableFragment()}
      LEFT JOIN LATERAL (
        SELECT jsonb_agg(ur.role ${createSortRoleFragment(
          sql.identifier(["ur", "role"]),
        )}) AS role
        FROM "public"."st__user_roles" as ur
        WHERE ur.user_id = ${this.tableIdentifier}.id
      ) AS user_role ON TRUE
      WHERE id = ${id}
      ${this.getSoftDeleteFilterFragment(false)};
    `;
  };

  getListSql = (
    limit?: number,
    offset?: number,
    filters?: FilterInput,
    sort?: SortInput[],
  ): QuerySqlToken => {
    return sql.type(this.validationSchema)`
      SELECT
        ${this.getTableFragment()}.*,
        COALESCE(user_role.role, '[]') AS roles
      FROM ${this.getTableFragment()}
      LEFT JOIN LATERAL (
        SELECT jsonb_agg(ur.role ${createSortRoleFragment(
          sql.identifier(["ur", "role"]),
          sort,
        )}) AS role
        FROM "public"."st__user_roles" as ur
        WHERE ur.user_id = ${this.tableIdentifier}.id
      ) AS user_role ON TRUE
      ${this.getFilterFragment(filters)}
      ${this.getSoftDeleteFilterFragment(!filters)}
      ${this.getSortFragment(sort)}
      ${this.getLimitFragment(limit, offset)};
    `;
  };

  getUpdateSql = (
    id: number | string,
    data: UserUpdateInput | ChangeEmailInput,
  ): QuerySqlToken => {
    const columns = [];

    for (const column in data) {
      const value = data[column as keyof typeof data];
      columns.push(
        sql.fragment`${sql.identifier([humps.decamelize(column)])} = ${value}`,
      );
    }

    return sql.type(this.validationSchema)`
      UPDATE ${this.getTableFragment()}
      SET ${sql.join(columns, sql.fragment`, `)}
      WHERE id = ${id}
      ${this.getSoftDeleteFilterFragment(false)}
      RETURNING *, (
        SELECT COALESCE(user_role.role, '[]') AS roles
        FROM ${this.getTableFragment()}
        LEFT JOIN LATERAL (
          SELECT jsonb_agg(ur.role ${createSortRoleFragment(
            sql.identifier(["ur", "role"]),
          )}) AS role
          FROM "public"."st__user_roles" as ur
          WHERE ur.user_id = ${this.tableIdentifier}.id
        ) AS user_role ON TRUE
        WHERE id = ${id}
      ) as roles;
    `;
  };

  get table() {
    return this.config.user?.tables?.users?.name || super.table;
  }
}

export default UserSqlFactory;
