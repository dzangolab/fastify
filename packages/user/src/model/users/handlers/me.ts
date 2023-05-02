import Service from "../service";

import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const me = async (request: SessionRequest, reply: FastifyReply) => {
  const service = new Service(request.config, request.slonik);
  const userId = request.session?.getUserId();

  if (userId) {
    reply.send(await service.findById(userId));
  } else {
    request.log.error("Could not able to get user id from session");

    throw new Error("Oops, Something went wrong");
  }
};

export default me;
