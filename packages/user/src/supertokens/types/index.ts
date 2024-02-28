import type { EmailVerificationRecipe } from "./emailVerificationRecipe";
import type { SessionRecipe } from "./sessionRecipe";
import type { ThirdPartyEmailPasswordRecipe } from "./thirdPartyEmailPasswordRecipe";
import type { FastifyInstance } from "fastify";
import type { TypeInput as EmailVerificationRecipeConfig } from "supertokens-node/recipe/emailverification/types";
import type { TypeInput as SessionRecipeConfig } from "supertokens-node/recipe/session/types";
import type {
  TypeInput as ThirdPartyEmailPasswordRecipeConfig,
  ThirdPartyProviderInput,
} from "supertokens-node/recipe/thirdpartyemailpassword/types";
import type { TypeInput as UserRolesRecipeConfig } from "supertokens-node/recipe/userroles/types";

interface SupertokensRecipes {
  emailVerification?:
    | EmailVerificationRecipe
    | ((fastify: FastifyInstance) => EmailVerificationRecipeConfig);
  session?: SessionRecipe | ((fastify: FastifyInstance) => SessionRecipeConfig);
  userRoles?: (fastify: FastifyInstance) => UserRolesRecipeConfig;
  thirdPartyEmailPassword?:
    | ThirdPartyEmailPasswordRecipe
    | ((fastify: FastifyInstance) => ThirdPartyEmailPasswordRecipeConfig);
}

interface SupertokensConfig {
  connectionUri: string;
  providers?: ThirdPartyProviderInput[];
  recipes?: SupertokensRecipes;
  resetPasswordPath?: string;
  emailVerificationPath?: string;
  sendUserAlreadyExistsWarning?: boolean;
}

export type { SupertokensConfig, SupertokensRecipes };
