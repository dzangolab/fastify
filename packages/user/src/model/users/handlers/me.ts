import { EmailVerificationClaim } from "supertokens-node/recipe/emailverification";
import { getUserById } from "supertokens-node/recipe/thirdpartyemailpassword";

import createUserContext from "../../../supertokens/utils/createUserContext";
import ProfileValidationClaim from "../../../supertokens/utils/profileValidationClaim";

import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const me = async (request: SessionRequest, reply: FastifyReply) => {
  if (request.user) {
    const thirdPartyUser = await getUserById(request.user?.id);

    if (request.config.user.features?.profileValidation?.enabled) {
      await request.session?.fetchAndSetClaim(
        new ProfileValidationClaim(),
        createUserContext(undefined, request),
      );
    }

    if (request.config.user.features?.signUp?.emailVerification) {
      await request.session?.fetchAndSetClaim(
        EmailVerificationClaim,
        createUserContext(undefined, request),
      );
    }

    const response = {
      ...request.user,
      thirdParty: thirdPartyUser?.thirdParty,
    };

    reply.send(response);
  } else {
    request.log.error("Could not able to get user from session");

    throw new Error("Oops, Something went wrong");
  }
};

export default me;
