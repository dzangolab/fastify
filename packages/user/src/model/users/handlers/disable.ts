import { Error as STError } from "supertokens-node/recipe/session";
import userRoles from "supertokens-node/recipe/userroles";

import { ROLE_ADMIN } from "../../../constants";
import Service from "../service";

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

    const roles = await request.session.getClaimValue(userRoles.UserRoleClaim);

    if (roles === undefined || !roles.includes(ROLE_ADMIN)) {
      throw new STError({
        type: "INVALID_CLAIMS",
        message: "User is not an admin",
        payload: [
          {
            id: userRoles.UserRoleClaim.key,
            reason: {
              message: "wrong value",
              expectedToInclude: ROLE_ADMIN,
            },
          },
        ],
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

      return await reply.send({ message: `user id ${id} not found` });
    }

    return await reply.send({ status: "OK" });
  } else {
    request.log.error("could not get user from session");

    throw new Error("Oops, Something went wrong");
  }
};

export default disable;
