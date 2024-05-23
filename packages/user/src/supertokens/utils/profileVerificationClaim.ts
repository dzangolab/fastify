import { BooleanClaim } from "supertokens-node/lib/build/recipe/session/claims";

import type { FastifyInstance } from "fastify";
import type { SessionClaimValidator } from "supertokens-node/recipe/session";

class ProfileVerificationClaim extends BooleanClaim {
  declare validators: BooleanClaim["validators"] & {
    isVerified: (
      refetchTimeOnFalseInSeconds?: number,
      maxAgeInSeconds?: number
    ) => SessionClaimValidator;
  };

  constructor(fastify: FastifyInstance) {
    super({
      key: "pv",
      fetchValue: async (userId, userContext) => {
        const { isProfileComplete } = fastify.config.user;

        return isProfileComplete ? isProfileComplete(userContext.user) : true;
      },
      defaultMaxAgeInSeconds: 300,
    });

    this.validators = {
      ...this.validators,
      isVerified: (
        refetchTimeOnFalseInSeconds = 10,
        maxAgeInSeconds = 300
      ) => ({
        ...this.validators.hasValue(true, maxAgeInSeconds),

        shouldRefetch: (payload: unknown, userContext: unknown) => {
          const value = this.getValueFromPayload(payload, userContext);

          return (
            value === undefined ||
            this.getLastRefetchTime(payload, userContext)! <
              Date.now() - maxAgeInSeconds * 1000 ||
            (value === false &&
              this.getLastRefetchTime(payload, userContext)! <
                Date.now() - refetchTimeOnFalseInSeconds * 1000)
          );
        },
      }),
    };
  }
}

export default ProfileVerificationClaim;
