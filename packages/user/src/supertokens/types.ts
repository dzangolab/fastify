import Apple from "supertokens-node/lib/build/recipe/thirdparty/providers/apple";
import Facebook from "supertokens-node/lib/build/recipe/thirdparty/providers/facebook";
import Github from "supertokens-node/lib/build/recipe/thirdparty/providers/github";
import Google from "supertokens-node/lib/build/recipe/thirdparty/providers/google";

import type { FastifyInstance } from "fastify";
import type { TypeInput as SessionRecipeConfig } from "supertokens-node/recipe/session/types";
import type { TypeInput as ThirdPartyEmailPasswordRecipeConfig } from "supertokens-node/recipe/thirdpartyemailpassword/types";
import type { TypeInput as UserRolesRecipeConfig } from "supertokens-node/recipe/userroles/types";

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

interface SupertokensConfig {
  connectionUri: string;
  providers?: SupertokensThirdPartyProvider;
  recipes?: SupertokensRecipes;
  resetPasswordPath?: string;
  supportedEmailDomains?: string[];
  sendUserAlreadyExistsWarning?: boolean;
}

interface responseType {
  statusCode: number;
  status: string;
  message?: string;
}

export type { SupertokensConfig, SupertokensRecipes, responseType };
