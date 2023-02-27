import type { TypeInput as SessionRecipeConfig } from "supertokens-node/recipe/session/types";

const getSessionRecipeConfig = (): SessionRecipeConfig => {
  return {
    override: {
      functions: function (originalImplementation) {
        return {
          ...originalImplementation,
          createNewSession: async function (input) {
            input.accessTokenPayload = {
              ...input.accessTokenPayload,
            };
            return originalImplementation.createNewSession(input);
          },
        };
      },
    },
  };
};

export default getSessionRecipeConfig;
