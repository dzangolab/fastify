import { BaseService } from "@dzangolab/fastify-slonik";

import InvitationSqlFactory from "./sqlFactory";
import getInvitationLink from "./utils/getInvitationLink";

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

  protected _mailer: FastifyMailer | undefined;

  constructor(
    config: ApiConfig,
    database: Database,
    schema?: string,
    mailer?: FastifyMailer
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

  protected postCreate = async (result: Invitation): Promise<Invitation> => {
    this.sendInvitation(result);

    return result;
  };

  protected sendInvitation = async (invitation: Invitation): Promise<void> => {
    if (!this._mailer) {
      throw new Error(`Mailer is not defined`);
    }

    sendEmail({
      config: this._config,
      mailer: this._mailer,
      subject: "Invitation for Sign Up",
      templateData: {
        invitationLink: getInvitationLink(
          invitation.appId as number,
          invitation.token as string,
          this._config
        ),
      },
      templateName: "create-invitation",
      to: invitation.email as string,
    });
  };
}

const sendEmail = async ({
  config,
  mailer,
  subject,
  templateData = {},
  templateName,
  to,
}: {
  config: ApiConfig;
  mailer: FastifyMailer;
  subject: string;
  templateData?: Record<string, string>;
  templateName: string;
  to: string;
}) => {
  return mailer.sendMail({
    subject: subject,
    templateName: templateName,
    to: to,
    templateData: {
      appName: config.appName,
      ...templateData,
    },
  });
};

export default InvitationService;
