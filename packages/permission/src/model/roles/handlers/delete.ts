import CustomApiError from "../../../customApiError";
import Service from "../service";

import type { FastifyReply, FastifyRequest } from "fastify";

const deleteRole = async (request: FastifyRequest, reply: FastifyReply) => {
  const service = new Service(request.config, request.slonik);

  const { id } = request.params as { id: number };

  try {
    const data = await service.delete(id);

    reply.send(data);
  } catch (error) {
    if (error instanceof CustomApiError) {
      reply.status(error.statusCode);

      return reply.send({
        message: error.message,
        name: error.name,
        statusCode: error.statusCode,
      });
    }

    request.log.error(error);
    reply.status(500);

    return reply.send({
      status: "ERROR",
      message: "Oops! Something went wrong",
    });
  }
};

export default deleteRole;
