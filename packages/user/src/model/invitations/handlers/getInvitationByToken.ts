import Service from "../service";

import type { FastifyReply, FastifyRequest } from "fastify";

const getInvitationByToken = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { config, dbSchema, log, params, slonik } = request;

  const { token } = params as { token: string };

  try {
    const service = new Service(config, slonik, dbSchema);

    const invitation = await service.findByToken(token);

    // [DU 2023-JUL-11] Validation need be done by frontend.

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
