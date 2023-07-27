import { DefaultSqlFactory } from "@dzangolab/fastify-slonik";
import { sql } from "slonik";

import type { SqlFactory } from "@dzangolab/fastify-slonik";
import type { QueryResultRow, QuerySqlToken } from "slonik";

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
    SqlFactory<Invitation, InvitationCreateInput, InvitationUpdateInput>
{
  /* eslint-enabled */
  getFindByTokenSql = (token: string): QuerySqlToken => {
    return sql.type(this.validationSchema)`
      SELECT *
      FROM ${this.getTableFragment()}
      WHERE token = ${token};
    `;
  };
}

export default InvitationSqlFactory;
