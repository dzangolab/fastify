import { BooleanClaim } from "supertokens-node/lib/build/recipe/session/claims";

import getUserService from "../../lib/getUserService";

import type { FastifyInstance, FastifyRequest } from "fastify";

class ProfileVerificationClaim extends BooleanClaim {
  static key = "pv";

  constructor(fastify: FastifyInstance, request: FastifyRequest) {
    super({
      key: "pv",
      fetchValue: async (userId) => {
        const profileValidate = fastify.config.user.features?.profileValidate;

        if (!profileValidate?.enable) {
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

        return fields.some((field) => Boolean(user[field]));
      },
      defaultMaxAgeInSeconds: 0,
    });
  }

  // eslint-disable-next-line unicorn/no-useless-undefined, @typescript-eslint/no-unused-vars
  getLastRefetchTime = (payload: unknown, userContext: unknown) => undefined;
}

export default ProfileVerificationClaim;
