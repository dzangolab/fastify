import UserRoles from "supertokens-node/recipe/userroles";

import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const getPermissions = async (request: SessionRequest, reply: FastifyReply) => {
  const { log, query } = request;
  let permissions: string[] = [];

  try {
    const { role } = query as { role?: string };

    if (role) {
      const response = await UserRoles.getPermissionsForRole(role);

      if (response.status === "OK") {
        permissions = response.permissions;
      }
    }

    reply.send({ permissions });
  } catch (error) {
    log.error(error);
    reply.status(500);

    reply.send({
      status: "ERROR",
      message: "Oops! Something went wrong",
    });
  }
};

export default getPermissions;
