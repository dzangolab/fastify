import type { TypeInput as SessionRecipeConfig } from "supertokens-node/recipe/session/types";

const getSessionRecipeConfig = (): SessionRecipeConfig => {
  return {
    getTokenTransferMethod: (input) => {
      return input.req.getHeaderValue("st-auth-mode") === "header"
        ? "header"
        : "cookie";
    },
  };
};

export default getSessionRecipeConfig;
