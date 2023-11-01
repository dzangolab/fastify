import refreshPOST from "./session/refreshPost";

import type { FastifyInstance } from "fastify";
import type { TypeInput as SessionRecipeConfig } from "supertokens-node/recipe/session/types";

const getSessionRecipeConfig = (
  fastify: FastifyInstance
): SessionRecipeConfig => {
  return {
    getTokenTransferMethod: (input) => {
      return input.req.getHeaderValue("st-auth-mode") === "header"
        ? "header"
        : "cookie";
    },
    override: {
      apis: (originalImplementation) => {
        return {
          ...originalImplementation,
          refreshPOST: refreshPOST(originalImplementation, fastify),
        };
      },
      functions: (originalImplementation) => {
        return originalImplementation;
      },
    },
  };
};

export default getSessionRecipeConfig;
