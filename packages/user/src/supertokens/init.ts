import supertokens from "supertokens-node";

import getRecipeList from "./recipes";
import { DEFAULT_WEBSITE_BASE_PATH } from "../constants";

import type { FastifyInstance } from "fastify";

const init = (fastify: FastifyInstance) => {
  const { config } = fastify;

  supertokens.init({
    appInfo: {
      apiBasePath: config.user.supertokens.apiBasePath,
      apiDomain: config.baseUrl as string,
      appName: config.appName as string,
      websiteBasePath:
        config.user.supertokens.websiteBasePath ?? DEFAULT_WEBSITE_BASE_PATH,
      websiteDomain: config.appOrigin[0] as string,
    },
    framework: "fastify",
    recipeList: getRecipeList(fastify),
    supertokens: {
      connectionURI: config.user.supertokens.connectionUri as string,
    },
  });
};

export default init;
