import CustomApiError from "../../../customApiError";
import RoleService from "../service";

import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const updatePermissions = async (
  request: SessionRequest,
  reply: FastifyReply,
) => {
  const { log, body } = request;

  try {
    const { role, permissions } = body as {
      role: string;
      permissions: string[];
    };

    const service = new RoleService();
    const updatedPermissionsResponse = await service.updateRolePermissions(
      role,
      permissions,
    );

    return reply.send(updatedPermissionsResponse);
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

export default updatePermissions;
