import supertokens from "supertokens-node";

import getRecipeList from "./recipes";

import type { FastifyInstance } from "fastify";

const init = (fastify: FastifyInstance) => {
  const { config } = fastify;

  supertokens.init({
    appInfo: {
      apiDomain: config.baseUrl as string,
      appName: config.appName as string,
      websiteDomain: config.appOrigin[0] as string,
    },
    recipeList: getRecipeList(fastify),
    supertokens: {
      connectionURI: config.user.supertokens.connectionUri as string,
    },
  });
};

export default init;
