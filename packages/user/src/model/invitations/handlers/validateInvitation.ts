import Service from "../service";

import type { FastifyReply, FastifyRequest } from "fastify";

const validateInvitation = async (
  request: FastifyRequest<{ Querystring: { token: string } }>,
  reply: FastifyReply
) => {
  const { query, config, dbSchema, log, slonik } = request;

  try {
    const service = new Service(config, slonik, dbSchema);

    const invitation = await service.findByToken(query.token);

    // [DU 2023-JUL-07] TODO: Add condition to check the token validity

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

export default validateInvitation;
