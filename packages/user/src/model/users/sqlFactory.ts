import { DefaultSqlFactory } from "@dzangolab/fastify-slonik";
import { QueryResultRow, sql } from "slonik";

import type { SqlFactory } from "@dzangolab/fastify-slonik";

/* eslint-disable brace-style */
class UsersSqlFactory<
    User extends QueryResultRow,
    UserCreateInput extends QueryResultRow,
    UserUpdateInput extends QueryResultRow
  >
  extends DefaultSqlFactory<User, UserCreateInput, UserUpdateInput>
  implements SqlFactory<User, UserCreateInput, UserUpdateInput>
{
  /* eslint-enabled */
  getListSql = () => {
    return sql<User>`
      SELECT
        COALESCE(ep.email, tu.email) as email,
        COALESCE(ep.time_joined, tu.time_joined) as time_joined,
        COALESCE(ep.email, tu.email) as email,
        u.*
      FROM ${this.getTableFragment()} ru
      left join st__emailpassword_users ep on ru.user_id = ep.user_id
      left join st__thirdparty_users tu on ru.user_id = tu.user_id
      left join users u on ru.user_id = u.id;
    `;
  };
  // getListSql = (
  //   limit: number,
  //   offset?: number,
  //   filters?: FilterInput,
  //   sort?: SortInput[]
  // ) => {
  //   const tableIdentifier = createTableIdentifier(this.table, this.schema);
  //   return sql<UserProfile>`
  //     SELECT
  //       COALESCE(ep.email, tu.email) as email,
  //       COALESCE(ep.time_joined, tu.time_joined) as time_joined,
  //       u.*
  //       FROM ${this.getTableFragment()} ru
  //         left join st__emailpassword_users ep on ru.user_id = ep.user_id
  //         left join st__thirdparty_users tu on ru.user_id = tu.user_id
  //         left join users u on ru.user_id = u.id
  //     ${createFilterFragment(filters, tableIdentifier)}
  //     ${createSortFragment(tableIdentifier, sort)}
  //     ${createLimitFragment(limit, offset)};
  //   `;
  // };
}

export default UsersSqlFactory;
