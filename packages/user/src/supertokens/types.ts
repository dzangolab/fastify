import EmailVerification from "supertokens-node/recipe/emailverification";
import ThirdPartyEmailPassword from "supertokens-node/recipe/thirdpartyemailpassword";

import type { FastifyInstance } from "fastify";
import type { EmailDeliveryInterface } from "supertokens-node/lib/build/ingredients/emaildelivery/types";
import type { TypeEmailPasswordPasswordResetEmailDeliveryInput } from "supertokens-node/lib/build/recipe/emailpassword/types";
import type {
  TypeInput as EmailVerificationRecipeConfig,
  TypeEmailVerificationEmailDeliveryInput,
} from "supertokens-node/recipe/emailverification/types";
import type { TypeInput as SessionRecipeConfig } from "supertokens-node/recipe/session/types";
import type {
  TypeInput as ThirdPartyEmailPasswordRecipeConfig,
  APIInterface,
  RecipeInterface,
  TypeInputSignUp,
} from "supertokens-node/recipe/thirdpartyemailpassword/types";
import type { TypeInput as UserRolesRecipeConfig } from "supertokens-node/recipe/userroles/types";

const { Apple, Facebook, Github, Google } = ThirdPartyEmailPassword;

type APIInterfaceWrapper = {
  [key in keyof APIInterface]?: (
    originalImplementation: APIInterface,
    fastify: FastifyInstance
  ) => APIInterface[key];
};

type SendEmailWrapper = (
  originalImplementation: EmailDeliveryInterface<TypeEmailPasswordPasswordResetEmailDeliveryInput>,
  fastify: FastifyInstance
) => typeof ThirdPartyEmailPassword.sendEmail;

type EmailVerificationSendEmailWrapper = (
  originalImplementation: EmailDeliveryInterface<TypeEmailVerificationEmailDeliveryInput>,
  fastify: FastifyInstance
) => typeof EmailVerification.sendEmail;

type RecipeInterfaceWrapper = {
  [key in keyof RecipeInterface]?: (
    originalImplementation: RecipeInterface,
    fastify: FastifyInstance
  ) => RecipeInterface[key];
};

interface SupertokensRecipes {
  emailVerification?:
    | EmailVerificationRecipe
    | ((fastify: FastifyInstance) => EmailVerificationRecipeConfig);
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

interface EmailVerificationRecipe {
  mode?: "REQUIRED" | "OPTIONAL";
  sendEmail?: EmailVerificationSendEmailWrapper;
}

interface ThirdPartyEmailPasswordRecipe {
  override?: {
    apis?: APIInterfaceWrapper;
    functions?: RecipeInterfaceWrapper;
  };
  sendEmail?: SendEmailWrapper;
  signUpFeature?: TypeInputSignUp;
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
  EmailVerificationRecipe,
  EmailVerificationSendEmailWrapper,
  RecipeInterfaceWrapper,
  SendEmailWrapper,
  SupertokensConfig,
  SupertokensRecipes,
  ThirdPartyEmailPasswordRecipe,
};
