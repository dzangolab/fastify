import sendEmail from "../../../lib/sendEmail";
import getOrigin from "../../../supertokens/utils/getOrigin";
import Service from "../service";
import getInvitationLink from "../utils/getInvitationLink";
import isInvitationValid from "../utils/isInvitationValid";

import type {
  Invitation,
  InvitationCreateInput,
  InvitationUpdateInput,
} from "../../../types/invitation";
import type { FastifyReply } from "fastify";
import type { QueryResultRow } from "slonik";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const resendInvitation = async (
  request: SessionRequest,
  reply: FastifyReply
) => {
  const { config, dbSchema, headers, hostname, log, mailer, params, slonik } =
    request;

  try {
    const { id } = params as { id: string };

    const service = new Service<
      Invitation & QueryResultRow,
      InvitationCreateInput,
      InvitationUpdateInput
    >(config, slonik, dbSchema);

    const invitation = await service.findById(id);

    // is invitation valid
    if (!invitation || !isInvitationValid(invitation)) {
      return reply.send({
        status: "ERROR",
        message: "Invitation is invalid or has expired",
      });
    }

    // send invitation
    if (invitation) {
      const url = headers.referer || headers.origin || hostname;

      const origin = getOrigin(url) || config.appOrigin[0];

      try {
        sendEmail({
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
      } catch (error) {
        log.error(error);
      }

      const response: Partial<Invitation> = invitation;

      delete response.token;

      reply.send(response);
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
