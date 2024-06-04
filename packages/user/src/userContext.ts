import { wrapResponse } from "supertokens-node/framework/fastify";
import { EmailVerificationClaim } from "supertokens-node/recipe/emailverification";
import Session from "supertokens-node/recipe/session";
import UserRoles from "supertokens-node/recipe/userroles";

import getUserService from "./lib/getUserService";
import ProfileValidationClaim from "./supertokens/utils/profileValidationClaim";

import type { User } from "./types";
import type { FastifyRequest, FastifyReply } from "fastify";
import type { MercuriusContext } from "mercurius";

const userContext = async (
  context: MercuriusContext,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { config, slonik, dbSchema } = request;

  let userId: string | undefined;

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

    // eslint-disable-next-line unicorn/consistent-destructuring
    userId = request.session?.getUserId();
  } catch (error) {
    if (!Session.Error.isErrorFromSuperTokens(error)) {
      throw error;
    }
  }

  if (userId && !context.user) {
    const service = getUserService(config, slonik, dbSchema);

    /* eslint-disable-next-line unicorn/no-null */
    let user: User | null = null;

    try {
      user = await service.findById(userId);
    } catch {
      // FIXME [OP 2022-AUG-22] Handle error properly
      // DataIntegrityError
    }

    if (!user) {
      throw new Error("Unable to find user");
    }

    const { roles } = await UserRoles.getRolesForUser(userId);

    context.user = user;
    request.user = user;
    context.roles = roles;
  }
};

export default userContext;
