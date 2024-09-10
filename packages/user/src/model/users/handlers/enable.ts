import getUserService from "../../../lib/getUserService";

import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const enable = async (request: SessionRequest, reply: FastifyReply) => {
  if (request.session) {
    const { id } = request.params as { id: string };

    const service = getUserService(
      request.config,
      request.slonik,
      request.dbSchema,
    );

    const response = await service.update(id, { disabled: false });

    if (!response) {
      reply.status(404);

      return await reply.send({ message: `user id ${id} not found` });
    }

    return await reply.send({ status: "OK" });
  } else {
    request.log.error("could not get session");

    throw new Error("Oops, Something went wrong");
  }
};

export default enable;
