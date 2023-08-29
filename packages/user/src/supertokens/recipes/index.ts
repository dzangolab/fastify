import initEmailVerificationRecipe from "./initEmailVerificationRecipe";
import initSessionRecipe from "./initSessionRecipe";
import initThirdPartyEmailPassword from "./initThirdPartyEmailPasswordRecipe";
import initUserRolesRecipe from "./initUserRolesRecipe";

import type { FastifyInstance } from "fastify";
import type { RecipeListFunction } from "supertokens-node/types";

const getRecipeList = (fastify: FastifyInstance): RecipeListFunction[] => {
  const emailVerification =
    fastify.config.user.supertokens.recipes?.emailVerification;

  if (typeof emailVerification === "object" && emailVerification.disable) {
    return [
      initSessionRecipe(fastify),
      initThirdPartyEmailPassword(fastify),
      initUserRolesRecipe(fastify),
    ];
  }

  return [
    initEmailVerificationRecipe(fastify),
    initSessionRecipe(fastify),
    initThirdPartyEmailPassword(fastify),
    initUserRolesRecipe(fastify),
  ];
};

export default getRecipeList;
