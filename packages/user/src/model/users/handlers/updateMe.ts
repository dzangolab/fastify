import humps from "humps";

import ignoredUpdateProperties from "../ignoredUpdateProperties";
import Service from "../service";

import type { UserUpdateInput } from "../../../types";
import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const updateMe = async (request: SessionRequest, reply: FastifyReply) => {
  const userId = request.session?.getUserId();

  const input = request.body as UserUpdateInput;

  if (userId) {
    const service = new Service(
      request.config,
      request.slonik,
      request.dbSchema
    );

    for (const key of Object.keys(input)) {
      if (
        ignoredUpdateProperties.has(
          humps.camelize(key) as keyof UserUpdateInput
        )
      ) {
        delete input[key as keyof UserUpdateInput];
      }
    }

    reply.send(await service.update(userId, input));
  } else {
    request.log.error("Cound not get user id from session");

    throw new Error("Oops, Something went wrong");
  }
};

export default updateMe;
