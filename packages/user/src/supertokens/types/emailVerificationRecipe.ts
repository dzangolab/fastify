import EmailVerification from "supertokens-node/recipe/emailverification";

import type { FastifyInstance } from "fastify";
import type { EmailDeliveryInterface } from "supertokens-node/lib/build/ingredients/emaildelivery/types";
import type {
  TypeEmailVerificationEmailDeliveryInput,
  APIInterface,
  RecipeInterface,
} from "supertokens-node/recipe/emailverification/types";

type APIInterfaceWrapper = {
  [key in keyof APIInterface]?: (
    originalImplementation: APIInterface,
    fastify: FastifyInstance,
  ) => APIInterface[key];
};

type RecipeInterfaceWrapper = {
  [key in keyof RecipeInterface]?: (
    originalImplementation: RecipeInterface,
    fastify: FastifyInstance,
  ) => RecipeInterface[key];
};

type SendEmailWrapper = (
  originalImplementation: EmailDeliveryInterface<TypeEmailVerificationEmailDeliveryInput>,
  fastify: FastifyInstance,
) => typeof EmailVerification.sendEmail;

interface EmailVerificationRecipe {
  override?: {
    apis?: APIInterfaceWrapper;
    functions?: RecipeInterfaceWrapper;
  };
  mode?: "REQUIRED" | "OPTIONAL";
  sendEmail?: SendEmailWrapper;
}

export type {
  APIInterfaceWrapper,
  RecipeInterfaceWrapper,
  EmailVerificationRecipe,
  SendEmailWrapper,
};
