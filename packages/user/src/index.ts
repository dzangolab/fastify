import "@dzangolab/fastify-mercurius";

import userContext from "./userContext";

import type { SupertokensConfig } from "./supertokens";
import type { IsEmailOptions, StrongPasswordOptions, User } from "./types";
import type { PaginatedList } from "@dzangolab/fastify-slonik";
import type { MercuriusContext } from "mercurius";
import type { QueryResultRow } from "slonik";

declare module "mercurius" {
  interface MercuriusContext {
    roles: string[] | undefined;
    user: User | undefined;
  }
}

interface resolver {
  [key: string]: (
    parent: unknown,
    argyments_: {
      [key: string]: unknown;
    },
    context: MercuriusContext
  ) => Promise<QueryResultRow | null | PaginatedList<QueryResultRow>>;
}

declare module "@dzangolab/fastify-config" {
  interface ApiConfig {
    user: {
      context?: typeof userContext;
      email?: IsEmailOptions;
      graphql?: {
        resolver?: {
          mutation?: resolver;
          query?: resolver;
        };
      };
      password?: StrongPasswordOptions;
      supertokens: SupertokensConfig;
      table?: {
        name?: string;
      };
      features?: {
        signUp?: boolean;
      };
      role?: string;
    };
  }
}

export { default } from "./plugin";

export { default as userResolver } from "./model/users/resolver";
export { default as UserService } from "./model/users/service";
export { default as userRoutes } from "./model/users/controller";
export { default as formatDate } from "./supertokens/utils/formatDate";

export type { ThirdPartyEmailPasswordRecipe } from "./supertokens/types";
export type { AuthUser, UserCreateInput, UserUpdateInput, User } from "./types";
