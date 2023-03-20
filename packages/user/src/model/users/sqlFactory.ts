import {
  createLimitFragment,
  createMultipleSortFragments,
  createTableIdentifier,
  DefaultSqlFactory,
  FilterInput,
  SortInput,
} from "@dzangolab/fastify-slonik";
import { QueryResultRow, sql, TaggedTemplateLiteralInvocation } from "slonik";

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
  getListSql = (
    limit: number,
    offset?: number,
    filters?: FilterInput,
    sort?: SortInput[]
  ) => {
    let queries: TaggedTemplateLiteralInvocation<QueryResultRow>[] = [];
    if (sort) {
      for (const x of sort) {
        if (x.key === "email") {
          queries = [
            ...queries,
            ...createMultipleSortFragments(
              createTableIdentifier("st__emailpassword_users", "public"),
              [{ ...x }]
            ),
            ...createMultipleSortFragments(
              createTableIdentifier("st__thirdparty_users", "public"),
              [{ ...x }]
            ),
          ];
        } else if (x.key === "given_name") {
          queries = [
            ...queries,
            ...createMultipleSortFragments(
              createTableIdentifier("users", "public"),
              [{ ...x }]
            ),
          ];
        }
      }
    }

    return sql<User>`
      SELECT
      COALESCE(public.st__emailpassword_users.email, public.st__thirdparty_users.email) as email,
      COALESCE(public.st__emailpassword_users.time_joined, public.st__thirdparty_users.time_joined) as time_joined,
      public.users.*
      FROM ${this.getTableFragment()}
        left join public.st__emailpassword_users on public.st__all_auth_recipe_users.user_id = public.st__emailpassword_users.user_id
        left join public.st__thirdparty_users on public.st__all_auth_recipe_users.user_id = public.st__thirdparty_users.user_id
        left join public.users on public.st__all_auth_recipe_users.user_id = public.users.id
        ${sql`ORDER BY ${sql.join(queries, sql`,`)}`}
        ${createLimitFragment(limit, offset)};
    `;
  };
}

export default UsersSqlFactory;
