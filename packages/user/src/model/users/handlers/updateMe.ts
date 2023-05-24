import humps from "humps";

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

    const ignoredUserProperties = [
      "id",
      "email",
      "lastLoginAt",
      "signedUpAt",
    ] as Array<keyof UserUpdateInput>;

    for (const key of Object.keys(input)) {
      if (
        ignoredUserProperties.includes(
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
