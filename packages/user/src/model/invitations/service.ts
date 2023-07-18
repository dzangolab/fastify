import { BaseService } from "@dzangolab/fastify-slonik";

import InvitationSqlFactory from "./sqlFactory";
import sendEmail from "../../lib/sendEmail";

import type { ApiConfig } from "@dzangolab/fastify-config";
import type { FastifyMailer } from "@dzangolab/fastify-mailer";
import type { Database, Service } from "@dzangolab/fastify-slonik";
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

  protected _mailer: FastifyMailer;

  constructor(
    config: ApiConfig,
    database: Database,
    mailer: FastifyMailer,
    schema?: string
  ) {
    super(config, database, schema);

    this._mailer = mailer;
  }

  findByToken = async (token: string): Promise<Invitation | null> => {
    const query = this.factory.getFindByTokenSql(token);

    const result = await this.database.connect((connection) => {
      return connection.maybeOne(query);
    });

    return result as Invitation | null;
  };

  getInvitationLink = (invitation: Invitation): string => {
    // [DU 2023-JUL-07] Todo: Get details from config
    return `${this.config.user.invitation.fallbackUrl}/register/token/${invitation.token}`;
  };

  sendInvitation = async (invitation: Invitation): Promise<void> => {
    sendEmail({
      config: this.config,
      mailer: this.mailer,
      subject: "Invitation for Sign Up",
      templateData: {
        invitationLink: this.getInvitationLink(invitation),
      },
      templateName: "user-invitation",
      to: invitation.email as string,
    });
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

  get mailer(): FastifyMailer {
    return this._mailer;
  }

  protected postCreate = async (result: Invitation): Promise<Invitation> => {
    this.sendInvitation(result);

    return result;
  };
}

export default InvitationService;
