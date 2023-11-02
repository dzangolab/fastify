import { getRolesForUser } from "supertokens-node/recipe/userroles";

import { ROLE_ADMIN } from "../../../constants";
import Service from "../service";

import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const enable = async (request: SessionRequest, reply: FastifyReply) => {
  const userId = request.session?.getUserId();

  if (userId) {
    const { id } = request.params as { id: string };

    if (userId === id) {
      reply.status(409);

      return await reply.send({
        message: "you cannot enable yourself",
      });
    }

    const { roles } = await getRolesForUser(userId);

    if (roles.includes(ROLE_ADMIN)) {
      const service = new Service(
        request.config,
        request.slonik,
        request.dbSchema
      );

      const response = await service.update(id, { disabled: false });

      if (!response) {
        reply.status(404);

        return await reply.send({ message: "user not found" });
      }

      return await reply.send({ status: "OK" });
    }

    reply.status(401);

    return await reply.send({
      message: "only user with admin role can enable other user",
    });
  } else {
    request.log.error("could not get user id from session");

    throw new Error("Oops, Something went wrong");
  }
};

export default enable;
