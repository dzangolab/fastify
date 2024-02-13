import getUserService from "../../../lib/getUserService";

import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const disable = async (request: SessionRequest, reply: FastifyReply) => {
  if (request.session) {
    const { id } = request.params as { id: string };

    if (request.session.getUserId() === id) {
      reply.status(409);

      return await reply.send({
        message: "you cannot disable yourself",
      });
    }

    const service = getUserService(
      request.config,
      request.slonik,
      request.dbSchema
    );

    const response = await service.update(id, { disabled: true });

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

export default disable;
