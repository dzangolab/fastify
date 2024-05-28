import { BooleanClaim } from "supertokens-node/lib/build/recipe/session/claims";

import getUserService from "../../lib/getUserService";

import type { FastifyRequest } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

class ProfileValidationClaim extends BooleanClaim {
  static key = "profileValidation";

  constructor(request: FastifyRequest | SessionRequest) {
    super({
      key: "profileValidation",
      fetchValue: async (userId) => {
        const profileValidation =
          request.config.user.features?.profileValidation;

        if (!profileValidation?.enabled) {
          throw new Error("Profile validation is not enabled");
        }

        const service = getUserService(
          request.config,
          request.slonik,
          request.dbSchema
        );

        // [DU 2024-MAY-28]  This is redundant as we have already retrieved
        // user data from the database to check if the user is enabled.
        const user = await service.findById(userId);

        if (!user) {
          throw new Error("User not found");
        }

        const fields = profileValidation.fields || [];

        return !fields.some((field) => user[field] === null);
      },
      defaultMaxAgeInSeconds: 0,
    });
  }

  // eslint-disable-next-line unicorn/no-useless-undefined, @typescript-eslint/no-unused-vars
  getLastRefetchTime = (payload: unknown, userContext: unknown) => undefined;
}

export default ProfileValidationClaim;
