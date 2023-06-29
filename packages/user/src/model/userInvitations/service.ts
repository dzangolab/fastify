import { BaseService } from "@dzangolab/fastify-slonik";

import UserInvitationSqlFactory from "./sqlFactory";

import type { Service } from "@dzangolab/fastify-slonik";
import type { QueryResultRow } from "slonik";

class UserInvitationService<
    UserInvitation extends QueryResultRow,
    UserInvitationCreateInput extends QueryResultRow,
    UserInvitationUpdateInput extends QueryResultRow
  >
  extends BaseService<
    UserInvitation,
    UserInvitationCreateInput,
    UserInvitationUpdateInput
  >
  // eslint-disable-next-line prettier/prettier
  implements Service<UserInvitation, UserInvitationCreateInput, UserInvitationUpdateInput> {

  get table() {
    return "user_invitations";
  }

  get factory() {
    if (!this.table) {
      throw new Error(`Service table is not defined`);
    }

    if (!this._factory) {
      this._factory = new UserInvitationSqlFactory<
        UserInvitation,
        UserInvitationCreateInput,
        UserInvitationUpdateInput
      >(this);
    }

    return this._factory as UserInvitationSqlFactory<
      UserInvitation,
      UserInvitationCreateInput,
      UserInvitationUpdateInput
    >;
  }
}

export default UserInvitationService;
