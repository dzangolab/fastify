import getInvitationLink from "./getInvitationLink";
import sendEmail from "../../../lib/sendEmail";

import type { Invitation } from "../../../types/invitation";
import type { ApiConfig } from "@dzangolab/fastify-config";
import type { FastifyMailer } from "@dzangolab/fastify-mailer";
import type { FastifyBaseLogger } from "fastify";

const sendInvitation = async (
  invitation: Invitation,
  config: ApiConfig,
  mailer: FastifyMailer,
  log: FastifyBaseLogger,
  origin: string
) => {
  await sendEmail({
    config,
    mailer,
    log,
    subject: "Invitation for Sign Up",
    templateData: {
      invitationLink: getInvitationLink(config, invitation.token, origin),
    },
    templateName: "user-invitation",
    to: invitation.email,
  });
};

export default sendInvitation;
