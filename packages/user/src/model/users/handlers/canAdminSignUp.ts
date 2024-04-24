import getUserService from "../../../lib/getUserService";

import type { FastifyReply, FastifyRequest } from "fastify";

const canAdminSignUp = async (request: FastifyRequest, reply: FastifyReply) => {
  const { config, log, slonik } = request;

  try {
    const userService = getUserService(config, slonik);

    const isAdminExists = await userService.isAdminExists();

    if (isAdminExists) {
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
