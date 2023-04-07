import ThirdPartyEmailPassword from "supertokens-node/recipe/thirdpartyemailpassword";

import type { FastifyInstance } from "fastify";
import type { TypeInput as SessionRecipeConfig } from "supertokens-node/recipe/session/types";
import type {
  TypeInput as ThirdPartyEmailPasswordRecipeConfig,
  APIInterface,
  RecipeInterface,
} from "supertokens-node/recipe/thirdpartyemailpassword/types";
import type { TypeInput as UserRolesRecipeConfig } from "supertokens-node/recipe/userroles/types";

const { Apple, Facebook, Github, Google } = ThirdPartyEmailPassword;

type APIInterfaceWrapper = {
  [key in keyof APIInterface]?: (
    originalImplementation: APIInterface,
    fastify: FastifyInstance
  ) => APIInterface[key];
};

type RecipeInterfaceWrapper = {
  [key in keyof RecipeInterface]?: (
    originalImplementation: RecipeInterface,
    fastify: FastifyInstance
  ) => RecipeInterface[key];
};

interface SupertokensRecipes {
  session?: (fastify: FastifyInstance) => SessionRecipeConfig;
  userRoles?: (fastify: FastifyInstance) => UserRolesRecipeConfig;
  thirdPartyEmailPassword?:
    | ThirdPartyEmailPasswordRecipe
    | ((fastify: FastifyInstance) => ThirdPartyEmailPasswordRecipeConfig);
}

interface SupertokensThirdPartyProvider {
  apple?: Parameters<typeof Apple>[0];
  facebook?: Parameters<typeof Facebook>[0];
  github?: Parameters<typeof Github>[0];
  google?: Parameters<typeof Google>[0];
}

interface ThirdPartyEmailPasswordRecipe {
  override?: {
    apis?: APIInterfaceWrapper;
    function?: RecipeInterfaceWrapper;
  };
}

interface SupertokensConfig {
  connectionUri: string;
  providers?: SupertokensThirdPartyProvider;
  recipes?: SupertokensRecipes;
  resetPasswordPath?: string;
  sendUserAlreadyExistsWarning?: boolean;
}

export type {
  APIInterfaceWrapper,
  RecipeInterfaceWrapper,
  SupertokensConfig,
  SupertokensRecipes,
};
