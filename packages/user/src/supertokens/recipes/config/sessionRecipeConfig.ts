import ThirdPartyEmailPassword from "supertokens-node/recipe/thirdpartyemailpassword";

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
              user: await ThirdPartyEmailPassword.getUserById(input.userId),
            };

            return originalImplementation.createNewSession(input);
          },
        };
      },
    },
  };
};

export default getSessionRecipeConfig;
