import getUserService from "../../../lib/getUserService";
import ProfileValidationClaim from "../../../supertokens/utils/profileValidationClaim";

import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const me = async (request: SessionRequest, reply: FastifyReply) => {
  const service = getUserService(
    request.config,
    request.slonik,
    request.dbSchema
  );

  const userId = request.session?.getUserId();

  if (userId) {
    const user = await service.findById(userId);

    if (request.config.user.features?.profileValidation?.enabled) {
      await request.session?.fetchAndSetClaim(
        new ProfileValidationClaim(request)
      );
    }

    reply.send(user);
  } else {
    request.log.error("Could not able to get user id from session");

    throw new Error("Oops, Something went wrong");
  }
};

export default me;
