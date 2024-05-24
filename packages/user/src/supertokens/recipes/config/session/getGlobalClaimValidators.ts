import ProfileValidationClaim from "../../../utils/profileValidationClaim";

import type { FastifyInstance, FastifyRequest } from "fastify";
import type { RecipeInterface } from "supertokens-node/recipe/session/types";

const getGlobalClaimValidators = (
  originalImplementation: RecipeInterface,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fastify: FastifyInstance
): RecipeInterface["getGlobalClaimValidators"] => {
  return async (input) => {
    if (originalImplementation.getGlobalClaimValidators === undefined) {
      throw new Error("Should never come here");
    }

    const request: FastifyRequest = input.userContext._default.request.request;

    if (request.config.user.features?.profileValidate?.enabled) {
      const profileClaimValidator = new ProfileValidationClaim(
        fastify,
        request
      ).validators.isTrue();

      return [
        ...input.claimValidatorsAddedByOtherRecipes,
        profileClaimValidator,
      ];
    }

    return input.claimValidatorsAddedByOtherRecipes;
  };
};

export default getGlobalClaimValidators;
