import { Error as STError } from "supertokens-node/recipe/session";
import UserRoles from "supertokens-node/recipe/userroles";

import { ROLE_ADMIN } from "../../../constants";
import getUserService from "../../../lib/getUserService";

import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const enable = async (request: SessionRequest, reply: FastifyReply) => {
  if (request.session) {
    const { id } = request.params as { id: string };

    const roles = await request.session.getClaimValue(UserRoles.UserRoleClaim);

    if (roles === undefined || !roles.includes(ROLE_ADMIN)) {
      throw new STError({
        type: "INVALID_CLAIMS",
        message: "User is not an admin",
        payload: [
          {
            id: UserRoles.UserRoleClaim.key,
            reason: {
              message: "wrong value",
              expectedToInclude: ROLE_ADMIN,
            },
          },
        ],
      });
    }

    const service = getUserService(
      request.config,
      request.slonik,
      request.dbSchema
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
