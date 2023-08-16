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
  const { config } = fastify;

  const origin = getOrigin(url || "") || config.appOrigin[0];

  sendEmail({
    fastify,
    subject: "Invitation for Sign Up",
    templateData: {
      invitationLink: getInvitationLink(config, invitation, origin),
    },
    templateName: "user-invitation",
    to: invitation.email,
  });
};

export default sendInvitation;
