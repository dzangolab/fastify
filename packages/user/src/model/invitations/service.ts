import { BaseService } from "@dzangolab/fastify-slonik";

import InvitationSqlFactory from "./sqlFactory";

import type { Service } from "@dzangolab/fastify-slonik";
import type { QueryResultRow } from "slonik";

class InvitationService<
    Invitation extends QueryResultRow,
    InvitationCreateInput extends QueryResultRow,
    InvitationUpdateInput extends QueryResultRow
  >
  extends BaseService<Invitation, InvitationCreateInput, InvitationUpdateInput>
  // eslint-disable-next-line prettier/prettier
  implements Service<Invitation, InvitationCreateInput, InvitationUpdateInput> {

  get table() {
    return "invitations";
  }

  get factory() {
    if (!this.table) {
      throw new Error(`Service table is not defined`);
    }

    if (!this._factory) {
      this._factory = new InvitationSqlFactory<
        Invitation,
        InvitationCreateInput,
        InvitationUpdateInput
      >(this);
    }

    return this._factory as InvitationSqlFactory<
      Invitation,
      InvitationCreateInput,
      InvitationUpdateInput
    >;
  }
}

export default InvitationService;
