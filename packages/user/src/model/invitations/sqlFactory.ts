import { DefaultSqlFactory } from "@dzangolab/fastify-slonik";

import type { SqlFactory } from "@dzangolab/fastify-slonik";
import type { QueryResultRow } from "slonik";

/* eslint-disable brace-style */
class InvitationSqlFactory<
    Invitation extends QueryResultRow,
    InvitationCreateInput extends QueryResultRow,
    InvitationUpdateInput extends QueryResultRow
  >
  extends DefaultSqlFactory<
    Invitation,
    InvitationCreateInput,
    InvitationUpdateInput
  >
  implements
    SqlFactory<Invitation, InvitationCreateInput, InvitationUpdateInput> {
  /* eslint-enabled */
}

export default InvitationSqlFactory;
