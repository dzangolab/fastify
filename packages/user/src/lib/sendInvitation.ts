import getInvitationLink from "./getInvitationLink";
import sendEmail from "./sendEmail";

import type { Invitation } from "../types/invitation";
import type { FastifyInstance } from "fastify";

const sendInvitation = async (
  fastify: FastifyInstance,
  invitation: Invitation,
  origin?: string
) => {
  const { config } = fastify;

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
