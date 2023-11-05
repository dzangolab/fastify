import Session from "supertokens-node/recipe/session";

import getSessionRecipeConfig from "./config/sessionRecipeConfig";

import type { SupertokensRecipes } from "../types";
import type { FastifyInstance } from "fastify";

const init = (fastify: FastifyInstance) => {
  const recipes = fastify.config.user.supertokens.recipes as SupertokensRecipes;

  if (recipes && recipes.session) {
    return Session.init(recipes.session(fastify));
  }

  return Session.init(getSessionRecipeConfig());
};

export default init;
