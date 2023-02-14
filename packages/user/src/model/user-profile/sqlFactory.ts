import { DefaultSqlFactory } from "@dzangolab/fastify-slonik";

import type { SqlFactory } from "@dzangolab/fastify-slonik";
import type { QueryResultRow } from "slonik";

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
    SqlFactory<UserProfile, UserProfileCreateInput, UserProfileUpdateInput> {
  /* eslint-enabled */
}

export default UserSqlFactory;
