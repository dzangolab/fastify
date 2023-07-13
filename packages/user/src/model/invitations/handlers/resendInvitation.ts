import Service from "../service";
import getInvitationLink from "../utils/getInvitationLink";
import isInvitationValid from "../utils/isInvitationValid";
import sendEmail from "../utils/sendEmail";

import type { Invitation } from "../../../types/invitation";
import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const resendInvitation = async (
  request: SessionRequest,
  reply: FastifyReply
) => {
  const { config, dbSchema, log, mailer, params, slonik } = request;

  try {
    const { id } = params as { id: string };

    const service = new Service(config, slonik, dbSchema);

    const invitation = (await service.findById(
      id
    )) as Partial<Invitation> | null;

    // is invitation valid
    if (!invitation || !isInvitationValid(invitation as Invitation)) {
      reply.send({
        status: "ERROR",
        message: "Token invalid or expired",
      });
    }

    // send invitation
    if (
      invitation &&
      invitation.token &&
      invitation.appId &&
      invitation?.email
    ) {
      try {
        sendEmail({
          config,
          mailer,
          log,
          subject: "Invitation for Sign Up",
          templateData: {
            invitationLink: `${getInvitationLink(invitation.appId, config)}`,
          },
          templateName: "sign-up-invitation",
          to: invitation.email,
        });
      } catch (error) {
        log.error(error);
      }

      delete invitation.token;

      reply.send(invitation);
    }
  } catch (error) {
    log.error(error);
    reply.status(500);

    reply.send({
      status: "ERROR",
      message: "Oops! Something went wrong",
    });
  }
};

export default resendInvitation;
