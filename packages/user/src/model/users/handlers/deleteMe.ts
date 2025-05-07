import getUserService from "../../../lib/getUserService";

import type { FastifyReply, FastifyRequest } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const deleteMe = async (request: SessionRequest, reply: FastifyReply) => {
  const { body, config, dbSchema, session, slonik } =
    request as FastifyRequest<{
      Body: {
        password: string;
      };
    }>;

  const userId = session?.getUserId();

  const password = body?.password ?? "";

  if (userId) {
    const service = getUserService(config, slonik, dbSchema);

    await service.deleteMe(userId, password);

    reply.status(204).send();
  } else {
    request.log.error("could not get user id from session");

    throw new Error("Oops, Something went wrong");
  }
};

export default deleteMe;
