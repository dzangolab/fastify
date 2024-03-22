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
        throw {
          name: "UNKNOWN_ROLE_ERROR",
          message: `Invalid role`,
          statusCode: 422,
        };
      }

      const service = new RoleService();

      const deleteResponse = await service.deleteRole(role);

      return reply.send(deleteResponse);
    }

    throw {
      name: "UNKNOWN_ROLE_ERROR",
      message: `Invalid role`,
      statusCode: 422,
    };
  } catch (error) {
    log.error(error);
    reply.status(500);

    return reply.send({
      status: "ERROR",
      message: "Oops! Something went wrong",
    });
  }
};

export default deleteRole;
