import { DefaultSqlFactory } from "@dzangolab/fastify-slonik";

import type { SqlFactory } from "@dzangolab/fastify-slonik";
import type { QueryResultRow } from "slonik";

/* eslint-disable brace-style */
class UserInvitationSqlFactory<
    UserInvitation extends QueryResultRow,
    UserInvitationCreateInput extends QueryResultRow,
    UserInvitationUpdateInput extends QueryResultRow
  >
  extends DefaultSqlFactory<
    UserInvitation,
    UserInvitationCreateInput,
    UserInvitationUpdateInput
  >
  implements
    SqlFactory<
      UserInvitation,
      UserInvitationCreateInput,
      UserInvitationUpdateInput
    > {
  /* eslint-enabled */
}

export default UserInvitationSqlFactory;
