/* eslint-disable prettier/prettier, brace-style */
import { BaseService } from "@dzangolab/fastify-slonik";

import { TABLE_ACCOUNTS } from "../../constants";

import type { Service } from "@dzangolab/fastify-slonik";
import type { QueryResultRow } from "slonik";

class AccountService<
    Account extends QueryResultRow,
    AccountCreateInput extends QueryResultRow,
    AccountUpdateInput extends QueryResultRow
  >
  extends BaseService<
    Account,
    AccountCreateInput,
    AccountUpdateInput
  >
  implements
    Service<Account, AccountCreateInput, AccountUpdateInput>
  {
  static readonly TABLE = TABLE_ACCOUNTS;
  static readonly LIMIT_DEFAULT = 20;
  static readonly LIMIT_MAX = 50;
}

export default AccountService;
