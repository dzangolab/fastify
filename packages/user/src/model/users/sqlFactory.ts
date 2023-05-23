import {
  DefaultSqlFactory,
  createLimitFragment,
  createFilterFragment,
  createSortFragment,
  createTableIdentifier,
} from "@dzangolab/fastify-slonik";
import { QueryResultRow, QuerySqlToken, sql } from "slonik";

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

  getListSql = (
    limit: number,
    offset?: number,
    filters?: FilterInput,
    sort?: SortInput[]
  ): QuerySqlToken => {
    const tableIdentifier = createTableIdentifier(this.table, this.schema);

    return sql.unsafe`
      SELECT
        ${tableIdentifier}.*,
        COALESCE(user_role.role, '{}') AS role
      FROM ${tableIdentifier}
      LEFT JOIN LATERAL (
        SELECT json_agg(ur.role)
        AS role FROM "public"."st__user_roles" as ur
        WHERE ur.user_id = users.id
      ) AS user_role
      ON TRUE
      ${createFilterFragment(filters, tableIdentifier)}
      ${createSortFragment(tableIdentifier, this.getSortInput(sort))}
      ${createLimitFragment(limit, offset)};
    `;
  };
}

export default UserSqlFactory;
