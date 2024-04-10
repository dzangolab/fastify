import CustomApiError from "../../../customApiError";
import Service from "../service";

import type { Role, RoleCreateInput, RoleUpdateInput } from "../../../types";
import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const create = async (request: SessionRequest, reply: FastifyReply) => {
  const service = new Service<Role, RoleCreateInput, RoleUpdateInput>(
    request.config,
    request.slonik,
    request.dbSchema
  );

  const input = request.body as RoleCreateInput;

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
