import getInvitationLink from "./getInvitationLink";
import getOrigin from "./getOrigin";
import sendEmail from "./sendEmail";

import type { Invitation } from "../types/invitation";
import type { FastifyInstance } from "fastify";

const sendInvitation = async (
  fastify: FastifyInstance,
  invitation: Invitation,
  url?: string
) => {
  const { config, log } = fastify;

  const origin =
    config.apps?.find((app) => app.id === invitation.appId)?.origin ||
    getOrigin(url || "") ||
    config.appOrigin[0];

  if (origin) {
    sendEmail({
      fastify,
      subject: "Invitation for Sign Up",
      templateData: {
        invitationLink: getInvitationLink(config, invitation, origin),
      },
      templateName: "user-invitation",
      to: invitation.email,
    });
  } else {
    log.error(`Could not send email for invitation ID ${invitation.id}`);
  }
};

export default sendInvitation;
