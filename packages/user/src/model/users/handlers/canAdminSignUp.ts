import UserRoles from "supertokens-node/recipe/userroles";

import { ROLE_ADMIN, TENANT_ID } from "../../../constants";

import type { FastifyReply, FastifyRequest } from "fastify";

const canAdminSignUp = async (request: FastifyRequest, reply: FastifyReply) => {
  const { log } = request;

  try {
    // check if already admin user exists
    const adminUsers = await UserRoles.getUsersThatHaveRole(
      TENANT_ID,
      ROLE_ADMIN
    );

    if (adminUsers.status === "UNKNOWN_ROLE_ERROR") {
      return reply.send({
        status: "ERROR",
        message: adminUsers.status,
      });
    } else if (adminUsers.users.length > 0) {
      return reply.send({ signUp: false });
    }

    reply.send({ signUp: true });
  } catch (error) {
    log.error(error);
    reply.status(500);

    reply.send({
      status: "ERROR",
      message: "Oops! Something went wrong",
    });
  }
};

export default canAdminSignUp;
