import ProfileVerificationClaim from "../../../utils/profileVerificationClaim";

import type { FastifyInstance } from "fastify";
import type { RecipeInterface } from "supertokens-node/recipe/session/types";

const getSession = (
  originalImplementation: RecipeInterface,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fastify: FastifyInstance
): RecipeInterface["getGlobalClaimValidators"] => {
  return async (input) => {
    if (originalImplementation.getGlobalClaimValidators === undefined) {
      throw new Error("Should never come here");
    }

    return [
      ...input.claimValidatorsAddedByOtherRecipes,
      new ProfileVerificationClaim(fastify).validators.isTrue(),
    ];
  };
};

export default getSession;
