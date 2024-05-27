import { BooleanClaim } from "supertokens-node/lib/build/recipe/session/claims";

import getUserService from "../../lib/getUserService";

import type { FastifyRequest } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

class ProfileValidationClaim extends BooleanClaim {
  static key = "pv";

  constructor(request: FastifyRequest | SessionRequest) {
    super({
      key: "pv",
      fetchValue: async (userId) => {
        const profileValidate = request.config.user.features?.profileValidate;

        if (!profileValidate?.enabled) {
          throw new Error("Profile validation is not enabled");
        }

        const service = getUserService(
          request.config,
          request.slonik,
          request.dbSchema
        );

        const user = await service.findById(userId);

        if (!user) {
          throw new Error("User not found");
        }

        const fields = profileValidate.fields || [];

        return !fields.some((field) => user[field] === null);
      },
      defaultMaxAgeInSeconds: 0,
    });
  }

  // eslint-disable-next-line unicorn/no-useless-undefined, @typescript-eslint/no-unused-vars
  getLastRefetchTime = (payload: unknown, userContext: unknown) => undefined;
}

export default ProfileValidationClaim;
