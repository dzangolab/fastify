import ThirdPartyEmailPassword from "supertokens-node/recipe/thirdpartyemailpassword";

import getThirdPartyEmailPasswordRecipeConfig from "./config/thirdPartyEmailPasswordRecipeConfig";

import type { SupertokensRecipes } from "../types";
import type { FastifyInstance } from "fastify";

const init = (fastify: FastifyInstance) => {
  const recipes = fastify.config.user.supertokens.recipes as SupertokensRecipes;

  if (recipes && recipes.thirdPartyEmailPassword) {
    return ThirdPartyEmailPassword.init(
      recipes.thirdPartyEmailPassword(fastify)
    );
  }

  return ThirdPartyEmailPassword.init(
    getThirdPartyEmailPasswordRecipeConfig(fastify)
  );
};

export default init;
