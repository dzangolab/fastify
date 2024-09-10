import type { FastifyInstance } from "fastify";
import type { BaseRequest } from "supertokens-node/lib/build/framework";
import type { TypeInput as OpenIdTypeInput } from "supertokens-node/lib/build/recipe/openid/types";
import type {
  APIInterface,
  RecipeInterface,
  TokenTransferMethod,
  ErrorHandlers,
} from "supertokens-node/recipe/session/types";

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

interface SessionRecipe {
  useDynamicAccessTokenSigningKey?: boolean;
  sessionExpiredStatusCode?: number;
  invalidClaimStatusCode?: number;
  accessTokenPath?: string;
  cookieSecure?: boolean;
  cookieSameSite?: "strict" | "lax" | "none";
  cookieDomain?: string;
  getTokenTransferMethod?: (input: {
    req: BaseRequest;
    forCreateNewSession: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    userContext: any;
  }) => TokenTransferMethod | "any";
  errorHandlers?: ErrorHandlers;
  antiCsrf?: "VIA_TOKEN" | "VIA_CUSTOM_HEADER" | "NONE";
  exposeAccessTokenToFrontendInCookieBasedAuth?: boolean;
  override?: {
    apis?: APIInterfaceWrapper;
    functions?: RecipeInterfaceWrapper;
    openIdFeature?: OpenIdTypeInput["override"];
  };
}

export type { APIInterfaceWrapper, RecipeInterfaceWrapper, SessionRecipe };
