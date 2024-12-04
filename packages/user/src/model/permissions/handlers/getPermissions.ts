import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const getPermissions = async (request: SessionRequest, reply: FastifyReply) => {
  const { config, log } = request;

  try {
    const permissions: string[] = config.user.permissions || [];

    reply.send({ permissions });
  } catch (error) {
    log.error(error);
    reply.status(500);

    reply.send({
      message: "Oops! Something went wrong",
      status: "ERROR",
      statusCode: 500,
    });
  }
};

export default getPermissions;
