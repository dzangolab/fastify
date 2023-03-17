import { DefaultSqlFactory } from "@dzangolab/fastify-slonik";
import { QueryResultRow, sql } from "slonik";

import type { SqlFactory } from "@dzangolab/fastify-slonik";

/* eslint-disable brace-style */
class UserSqlFactory<
    UserProfile extends QueryResultRow,
    UserProfileCreateInput extends QueryResultRow,
    UserProfileUpdateInput extends QueryResultRow
  >
  extends DefaultSqlFactory<
    UserProfile,
    UserProfileCreateInput,
    UserProfileUpdateInput
  >
  implements
    SqlFactory<UserProfile, UserProfileCreateInput, UserProfileUpdateInput>
{
  /* eslint-enabled */
  getListSql = () => {
    return sql<UserProfile>`
      SELECT
        COALESCE(ep.email, tu.email) as email,
        COALESCE(ep.time_joined, tu.time_joined) as time_joined,
        COALESCE(ep.email, tu.email) as email,
        u.id,
        u.given_name,
        u.middle_names,
        u.surname
      FROM ${this.getTableFragment()} ru
      left join st__emailpassword_users ep on ru.user_id = ep.user_id
      left join st__thirdparty_users tu on ru.user_id = tu.user_id
      left join users u on ru.user_id = u.id;
    `;
  };
}

export default UserSqlFactory;
