import CustomApiError from "../../../customApiError";
import getUserService from "../../../lib/getUserService";

import type { FastifyReply, FastifyRequest } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const deleteMe = async (request: SessionRequest, reply: FastifyReply) => {
  const { body, config, dbSchema, log, slonik, user } =
    request as FastifyRequest<{
      Body: {
        password: string;
      };
    }>;

  try {
    if (!user) {
      return reply.status(401).send({
        error: "Unauthorised",
        message: "unauthorised",
      });
    }

    const password = body?.password ?? "";

    const service = getUserService(config, slonik, dbSchema);

    await service.deleteMe(user.id, password);

    reply.status(204).send();
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

export default deleteMe;
