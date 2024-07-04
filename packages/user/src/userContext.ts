import { wrapResponse } from "supertokens-node/framework/fastify";
import { EmailVerificationClaim } from "supertokens-node/recipe/emailverification";
import Session from "supertokens-node/recipe/session";

import ProfileValidationClaim from "./supertokens/utils/profileValidationClaim";

import type { FastifyRequest, FastifyReply } from "fastify";
import type { MercuriusContext } from "mercurius";

const userContext = async (
  context: MercuriusContext,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    request.session = (await Session.getSession(request, wrapResponse(reply), {
      sessionRequired: false,
      overrideGlobalClaimValidators: async (globalValidators) =>
        globalValidators.filter(
          (sessionClaimValidator) =>
            ![EmailVerificationClaim.key, ProfileValidationClaim.key].includes(
              sessionClaimValidator.id
            )
        ),
    })) as (typeof request)["session"];
  } catch (error) {
    if (!Session.Error.isErrorFromSuperTokens(error)) {
      throw error;
    }
  }

  context.user = request.user;
  context.roles = request.user?.roles;
};

export default userContext;
