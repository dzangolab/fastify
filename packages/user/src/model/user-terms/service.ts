import { BaseService } from "@dzangolab/fastify-slonik";

import UserSqlFactory from "./sqlFactory";

import type { Service } from "@dzangolab/fastify-slonik";
import type { QueryResultRow } from "slonik";

class UserTermsService<
    UserTerms extends QueryResultRow,
    UserTermsCreateInput extends QueryResultRow,
    UserTermsUpdateInput extends QueryResultRow
  >
  extends BaseService<UserTerms, UserTermsCreateInput, UserTermsUpdateInput>
  // eslint-disable-next-line prettier/prettier
  implements Service<UserTerms, UserTermsCreateInput, UserTermsUpdateInput> {
  static TABLE = "user_terms";

  get factory() {
    if (!this.table) {
      throw new Error(`Service table is not defined`);
    }

    if (!this._factory) {
      this._factory = new UserSqlFactory<
        UserTerms,
        UserTermsCreateInput,
        UserTermsUpdateInput
      >(this);
    }

    return this._factory as UserSqlFactory<
      UserTerms,
      UserTermsCreateInput,
      UserTermsUpdateInput
    >;
  }
}

export default UserTermsService;
