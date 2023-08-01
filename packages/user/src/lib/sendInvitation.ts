import getInvitationLink from "./getInvitationLink";
import sendEmail from "./sendEmail";
import getOrigin from "../supertokens/utils/getOrigin";

import type { Invitation } from "../types/invitation";
import type { FastifyInstance } from "fastify";

const sendInvitation = async (
  fastify: FastifyInstance,
  invitation: Invitation,
  url?: string
) => {
  const { config, mailer, log } = fastify;

  const origin = getOrigin(url || "") || config.appOrigin[0];

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
