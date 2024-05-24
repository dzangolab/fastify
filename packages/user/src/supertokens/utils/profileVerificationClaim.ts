import { BooleanClaim } from "supertokens-node/lib/build/recipe/session/claims";

import type { FastifyInstance, FastifyRequest } from "fastify";

class ProfileVerificationClaim extends BooleanClaim {
  static key = "pv";

  constructor(fastify: FastifyInstance, request: FastifyRequest) {
    super({
      key: "pv",
      fetchValue: async (userId) => {
        const { isProfileVerified } = fastify.config.user;

        return isProfileVerified
          ? await isProfileVerified(userId, request)
          : true;
      },
      defaultMaxAgeInSeconds: 0,
    });
  }
}

export default ProfileVerificationClaim;
