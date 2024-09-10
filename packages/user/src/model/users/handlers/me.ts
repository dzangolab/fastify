import createUserContext from "../../../supertokens/utils/createUserContext";
import ProfileValidationClaim from "../../../supertokens/utils/profileValidationClaim";

import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const me = async (request: SessionRequest, reply: FastifyReply) => {
  if (request.user) {
    if (request.config.user.features?.profileValidation?.enabled) {
      await request.session?.fetchAndSetClaim(
        new ProfileValidationClaim(),
        createUserContext(undefined, request),
      );
    }

    reply.send(request.user);
  } else {
    request.log.error("Could not able to get user from session");

    throw new Error("Oops, Something went wrong");
  }
};

export default me;
