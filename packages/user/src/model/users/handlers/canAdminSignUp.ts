import UserRoles from "supertokens-node/recipe/userroles";

import { ROLE_ADMIN, ROLE_SUPERADMIN } from "../../../constants";

import type { FastifyReply, FastifyRequest } from "fastify";

const canAdminSignUp = async (request: FastifyRequest, reply: FastifyReply) => {
  const { log } = request;

  try {
    // check if already admin user exists
    const adminUsers = await UserRoles.getUsersThatHaveRole(ROLE_ADMIN);
    const superAdminUsers =
      await UserRoles.getUsersThatHaveRole(ROLE_SUPERADMIN);

    if (
      adminUsers.status === "UNKNOWN_ROLE_ERROR" &&
      superAdminUsers.status === "UNKNOWN_ROLE_ERROR"
    ) {
      return reply.send({
        status: "ERROR",
        message: adminUsers.status,
      });
    } else if (
      (adminUsers.status === "OK" && adminUsers.users.length > 0) ||
      (superAdminUsers.status === "OK" && superAdminUsers.users.length > 0)
    ) {
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
