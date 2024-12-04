import getUserService from "../../../lib/getUserService";

import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const disable = async (request: SessionRequest, reply: FastifyReply) => {
  if (request.session) {
    const { id } = request.params as { id: string };

    if (request.session.getUserId() === id) {
      return await reply.status(409).send({
        message: "you cannot disable yourself",
      });
    }

    const service = getUserService(
      request.config,
      request.slonik,
      request.dbSchema,
    );

    const response = await service.update(id, { disabled: true });

    if (!response) {
      return await reply
        .status(404)
        .send({ message: `user id ${id} not found` });
    }

    return await reply.send({ status: "OK" });
  } else {
    request.log.error("could not get session");

    throw new Error("Oops, Something went wrong");
  }
};

export default disable;
