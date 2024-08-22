import CustomApiError from "../../../customApiError";
import Service from "../service";

import type { FastifyReply, FastifyRequest } from "fastify";
import type { QueryResultRow } from "slonik";

const create = async (request: FastifyRequest, reply: FastifyReply) => {
  const service = new Service(request.config, request.slonik);

  const input = request.body as QueryResultRow;

  try {
    const data = await service.create(input);

    return reply.send(data);
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

export default create;
