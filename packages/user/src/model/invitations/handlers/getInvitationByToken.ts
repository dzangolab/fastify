import getInvitationService from "../../../lib/getInvitationService";

import type { FastifyReply, FastifyRequest } from "fastify";

const getInvitationByToken = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { config, dbSchema, log, params, slonik } = request;

  const { token } = params as { token: string };

  try {
    const service = getInvitationService(config, slonik, dbSchema);

    const invitation = await service.findByToken(token);

    reply.send(invitation);
  } catch (error) {
    log.error(error);
    reply.status(500);

    reply.send({
      status: "ERROR",
      message: "Oops! Something went wrong",
    });
  }
};

export default getInvitationByToken;
