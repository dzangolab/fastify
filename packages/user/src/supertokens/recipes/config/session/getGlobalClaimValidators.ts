import ProfileVerificationClaim from "../../../utils/profileVerificationClaim";

import type { FastifyInstance } from "fastify";
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

    console.log("getGlobalClaimValidators input", input);

    const profileVerificationValidator = new ProfileVerificationClaim(
      fastify,
      input.userContext._default.request.request
    ).validators.isTrue();

    return [
      ...input.claimValidatorsAddedByOtherRecipes,
      profileVerificationValidator,
    ];
  };
};

export default getGlobalClaimValidators;
