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

    const data = (await service.findById(id)) as Partial<Invitation> | null;

    // is invitation valid
    if (!data || !isInvitationValid(data as Invitation)) {
      return reply.send({
        status: "ERROR",
        message: "Invitation invalid or expired",
      });
    }

    // send invitation
    if (data && data.token && data.appId && data.email) {
      try {
        sendEmail({
          config,
          mailer,
          log,
          subject: "Invitation for Sign Up",
          templateData: {
            invitationLink: `${getInvitationLink(data.appId, data.token)}`,
          },
          templateName: "sign-up-invitation",
          to: data.email,
        });
      } catch (error) {
        log.error(error);
      }

      delete data.token;

      reply.send(data);
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
