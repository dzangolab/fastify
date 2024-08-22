import CustomApiError from "../../../customApiError";
import Service from "../service";

import type {
  Permission,
  PermissionCreateInput,
  PermissionUpdateInput,
} from "../../../types/permission";
import type { FastifyReply, FastifyRequest } from "fastify";

const deleteRole = async (request: FastifyRequest, reply: FastifyReply) => {
  const { config, log, params, slonik } = request;

  const service = new Service<
    Permission,
    PermissionCreateInput,
    PermissionUpdateInput
  >(config, slonik);

  const { id } = params as { id: number };

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

    log.error(error);
    reply.status(500);

    return reply.send({
      status: "ERROR",
      message: "Oops! Something went wrong",
    });
  }
};

export default deleteRole;
