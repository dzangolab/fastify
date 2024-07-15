/* eslint-disable prettier/prettier, brace-style */
import { BaseService } from "@dzangolab/fastify-slonik";

import { TABLE_ACCOUNTS } from "../../constants";

import type { Service } from "@dzangolab/fastify-slonik";
import type { QueryResultRow } from "slonik";

class AccountsService<
    Accounts extends QueryResultRow,
    AccountsCreateInput extends QueryResultRow,
    AccountsUpdateInput extends QueryResultRow
  >
  extends BaseService<
    Accounts,
    AccountsCreateInput,
    AccountsUpdateInput
  >
  implements
    Service<Accounts, AccountsCreateInput, AccountsUpdateInput>
  {
  static readonly TABLE = TABLE_ACCOUNTS;
  static readonly LIMIT_DEFAULT = 20;
  static readonly LIMIT_MAX = 50;
}

export default AccountsService;
