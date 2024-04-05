import CustomApiError from "../../../customApiError";
import RoleService from "../service";

import type { FastifyReply } from "fastify";
import type { QueryResultRow } from "slonik";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const createRole = async (request: SessionRequest, reply: FastifyReply) => {
  const { body, log, dbSchema, config, slonik } = request;

  try {
    const service = new RoleService(config, slonik, dbSchema);

    const response = await service.create(body as QueryResultRow);

    return reply.send(response);
  } catch (error) {
    if (error instanceof CustomApiError) {
      reply.status(error.statusCode);

      return reply.send({
        message: error.message,
        name: error.name,
        statusCode: error.statusCode,
      });
    }

    log.error(error);
    reply.status(500);

    return reply.send({
      status: "ERROR",
      message: "Oops! Something went wrong",
    });
  }
};

export default createRole;
