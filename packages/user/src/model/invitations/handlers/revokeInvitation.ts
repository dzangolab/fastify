import formatDate from "../../../lib/formatDate";
import Service from "../service";

import type {
  Invitation,
  InvitationCreateInput,
  InvitationUpdateInput,
} from "../../../types/invitation";
import type { FastifyReply } from "fastify";
import type { QueryResultRow } from "slonik";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const revokeInvitation = async (
  request: SessionRequest,
  reply: FastifyReply
) => {
  const { config, dbSchema, log, params, slonik } = request;

  try {
    const { id } = params as { id: string };

    const service = new Service<
      Invitation & QueryResultRow,
      InvitationCreateInput,
      InvitationUpdateInput
    >(config, slonik, dbSchema);

    let invitation = await service.findById(id);

    if (!invitation) {
      return reply.send({
        status: "error",
        message: "Invitation not found",
      });
    } else if (invitation.acceptedAt) {
      return reply.send({
        status: "error",
        message: "Invitation is already accepted",
      });
    } else if (Date.now() > invitation.expiresAt) {
      return reply.send({
        status: "error",
        message: "Invitation is expired",
      });
    } else if (invitation.revokedAt) {
      return reply.send({
        status: "error",
        message: "Invitation is already revoked",
      });
    }

    invitation = await service.update(id, {
      revokedAt: formatDate(new Date(Date.now())),
    });

    const data: Partial<Invitation> = invitation;

    delete data.token;

    reply.send(data);
  } catch (error) {
    log.error(error);
    reply.status(500);

    reply.send({
      status: "ERROR",
      message: "Oops! Something went wrong",
    });
  }
};

export default revokeInvitation;
