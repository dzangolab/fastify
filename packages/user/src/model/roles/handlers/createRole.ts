import CustomApiError from "../../../customApiError";
import RoleService from "../service";

import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const createRole = async (request: SessionRequest, reply: FastifyReply) => {
  const { body, log, dbSchema, config, slonik } = request;

  const { role, permissions } = body as {
    role: string;
    permissions: string[];
  };

  try {
    const service = new RoleService(config, slonik, dbSchema);

    const createResponse = await service.create({ role, permissions });

    return reply.send(createResponse);
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
