import { DefaultSqlFactory } from "@dzangolab/fastify-slonik";
import { QueryResultRow } from "slonik";

import type { SqlFactory } from "@dzangolab/fastify-slonik";

/* eslint-disable brace-style */
class UserTermsSqlFactory<
    UserTerms extends QueryResultRow,
    UserTermsCreateInput extends QueryResultRow,
    UserTermsUpdateInput extends QueryResultRow
  >
  extends DefaultSqlFactory<
    UserTerms,
    UserTermsCreateInput,
    UserTermsUpdateInput
  >
  implements SqlFactory<UserTerms, UserTermsCreateInput, UserTermsUpdateInput> {
  /* eslint-enabled */
}

export default UserTermsSqlFactory;
