import ThirdPartyEmailPassword from "supertokens-node/recipe/thirdpartyemailpassword";

import type { FastifyInstance } from "fastify";
import type { TypeInput as SessionRecipeConfig } from "supertokens-node/recipe/session/types";
import type {
  TypeInput as ThirdPartyEmailPasswordRecipeConfig,
  APIInterface,
} from "supertokens-node/recipe/thirdpartyemailpassword/types";
import type { TypeInput as UserRolesRecipeConfig } from "supertokens-node/recipe/userroles/types";

const { Apple, Facebook, Github, Google } = ThirdPartyEmailPassword;

interface SupertokensRecipes {
  session?: (fastify: FastifyInstance) => SessionRecipeConfig;
  userRoles?: (fastify: FastifyInstance) => UserRolesRecipeConfig;
  thirdPartyEmailPassword?: (
    fastify: FastifyInstance
  ) => ThirdPartyEmailPasswordRecipeConfig;
}

interface SupertokensThirdPartyProvider {
  apple?: Parameters<typeof Apple>[0];
  facebook?: Parameters<typeof Facebook>[0];
  github?: Parameters<typeof Github>[0];
  google?: Parameters<typeof Google>[0];
}

interface APIInterfaceWrapper {
  emailPasswordSignUpPOST: (
    originalImplementation: APIInterface,
    fastify: FastifyInstance
  ) => APIInterface["emailPasswordSignUpPOST"];
}

interface ThirdPartyEmailPasswordRecipe {
  override?: {
    apis?: APIInterfaceWrapper;
  };
}

interface SupertokensConfig {
  connectionUri: string;
  providers?: SupertokensThirdPartyProvider;
  recipes?: SupertokensRecipes;
  resetPasswordPath?: string;
  sendUserAlreadyExistsWarning?: boolean;
  thirdPartyEmailPasswordRecipe?: ThirdPartyEmailPasswordRecipe;
}

export type { APIInterfaceWrapper, SupertokensConfig, SupertokensRecipes };
