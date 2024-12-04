import CustomApiError from "../../../customApiError";
import RoleService from "../service";

import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const deleteRole = async (request: SessionRequest, reply: FastifyReply) => {
  const { log, query } = request;

  try {
    let { role } = query as { role?: string };

    if (role) {
      try {
        role = JSON.parse(role) as string;
      } catch {
        /* empty */
      }

      if (typeof role != "string") {
        throw new CustomApiError({
          name: "UNKNOWN_ROLE_ERROR",
          message: `Invalid role`,
          statusCode: 422,
        });
      }

      const service = new RoleService();

      const deleteResponse = await service.deleteRole(role);

      return reply.send(deleteResponse);
    }

    throw new CustomApiError({
      name: "UNKNOWN_ROLE_ERROR",
      message: `Invalid role`,
      statusCode: 422,
    });
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
    return reply.status(500).send({
      message: "Oops! Something went wrong",
      status: "ERROR",
      statusCode: 500,
    });
  }
};

export default deleteRole;
