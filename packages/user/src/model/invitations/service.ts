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
  static readonly TABLE = "invitations";

  findByToken = async (token: string): Promise<Invitation | null> => {
    if (!this.validateUUID(token)) {
      // eslint-disable-next-line unicorn/no-null
      return null;
    }

    const query = this.factory.getFindByTokenSql(token);

    const result = await this.database.connect((connection) => {
      return connection.maybeOne(query);
    });

    return result as Invitation | null;
  };

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

  protected validateUUID = (uuid: string): boolean => {
    const regexp = /^[\da-f]{8}(?:\b-[\da-f]{4}){3}\b-[\da-f]{12}$/gi;

    return regexp.test(uuid);
  };
}

export default InvitationService;
