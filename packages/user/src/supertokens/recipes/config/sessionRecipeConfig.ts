import createNewSession from "./session/createNewSession";
import verifySession from "./session/verifySession";

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
          verifySession: verifySession(originalImplementation, fastify),
        };
      },
      functions: (originalImplementation) => {
        return {
          ...originalImplementation,
          createNewSession: createNewSession(originalImplementation, fastify),
        };
      },
    },
  };
};

export default getSessionRecipeConfig;
