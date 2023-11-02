import Service from "../service";

import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const disable = async (request: SessionRequest, reply: FastifyReply) => {
  const userId = request.session?.getUserId();

  if (userId) {
    const { id } = request.params as { id: string };

    if (userId === id) {
      reply.status(409);

      return await reply.send({
        message: "you cannot disable yourself",
      });
    }

    const service = new Service(
      request.config,
      request.slonik,
      request.dbSchema
    );

    const response = await service.update(id, { disabled: true });

    if (!response) {
      reply.status(404);

      return await reply.send({ message: `user id ${id}  not found` });
    }

    return await reply.send({ status: "OK" });
  } else {
    request.log.error("could not get user id from session");

    throw new Error("Oops, Something went wrong");
  }
};

export default disable;
