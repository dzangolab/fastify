import UserRoles from "supertokens-node/recipe/userroles";

import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const getRoles = async (request: SessionRequest, reply: FastifyReply) => {
  const { log } = request;
  let roles: string[] = [];

  try {
    const roleResponse = await UserRoles.getAllRoles();
    if (roleResponse.status === "OK") {
      roles = roleResponse.roles;
    }

    reply.send({ roles });
  } catch (error) {
    log.error(error);
    reply.status(500);

    reply.send({
      status: "ERROR",
      message: "Oops! Something went wrong",
    });
  }
};

export default getRoles;
