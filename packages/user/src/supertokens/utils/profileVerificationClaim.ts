import { BooleanClaim } from "supertokens-node/lib/build/recipe/session/claims";

import type { FastifyInstance, FastifyRequest } from "fastify";
import type { SessionClaimValidator } from "supertokens-node/recipe/session";

class ProfileVerificationClaim extends BooleanClaim {
  declare validators: BooleanClaim["validators"] & {
    isVerified: (
      refetchTimeOnFalseInSeconds?: number,
      maxAgeInSeconds?: number
    ) => SessionClaimValidator;
  };

  constructor(fastify: FastifyInstance, request: FastifyRequest) {
    super({
      key: "pv",
      fetchValue: async (userId) => {
        const { isProfileComplete } = fastify.config.user;

        return isProfileComplete
          ? await isProfileComplete(userId, request)
          : true;
      },
      defaultMaxAgeInSeconds: 0,
    });
  }
}

export default ProfileVerificationClaim;
