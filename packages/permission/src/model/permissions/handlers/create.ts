import CustomApiError from "../../../customApiError";
import Service from "../service";

import type {
  Permission,
  PermissionCreateInput,
  PermissionUpdateInput,
} from "../../../types/permission";
import type { FastifyReply, FastifyRequest } from "fastify";

const create = async (request: FastifyRequest, reply: FastifyReply) => {
  const { body, config, log, slonik } = request;

  const service = new Service<
    Permission,
    PermissionCreateInput,
    PermissionUpdateInput
  >(config, slonik);

  const input = body as PermissionCreateInput;

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

    log.error(error);
    reply.status(500);

    return reply.send({
      status: "ERROR",
      message: "Oops! Something went wrong",
    });
  }
};

export default create;
