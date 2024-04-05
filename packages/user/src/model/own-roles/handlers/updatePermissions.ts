import CustomApiError from "../../../customApiError";
import RoleService from "../service";

import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const updatePermissions = async (
  request: SessionRequest,
  reply: FastifyReply
) => {
  const { body, config, dbSchema, log, slonik } = request;

  try {
    const { roleId, permissions } = body as {
      roleId: number;
      permissions: string[];
    };

    const service = new RoleService(config, slonik, dbSchema);

    const updatedPermissionsResponse = await service.updateRolePermissions(
      roleId,
      permissions
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
