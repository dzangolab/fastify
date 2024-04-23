import initEmailVerificationRecipe from "./initEmailVerificationRecipe";
import initSessionRecipe from "./initSessionRecipe";
import initThirdPartyEmailPassword from "./initThirdPartyEmailPasswordRecipe";

import type { FastifyInstance } from "fastify";
import type { RecipeListFunction } from "supertokens-node/types";

const getRecipeList = (fastify: FastifyInstance): RecipeListFunction[] => {
  const recipeList = [
    initSessionRecipe(fastify),
    initThirdPartyEmailPassword(fastify),
  ];

  if (fastify.config.user.features?.signUp?.emailVerification) {
    recipeList.push(initEmailVerificationRecipe(fastify));
  }

  return recipeList;
};

export default getRecipeList;
