import "@dzangolab/fastify-mercurius";

import type { SupertokensConfig } from "./supertokens";
import type {
  IsEmailOptions,
  StrongPasswordOptions,
  User,
  Resolver,
  Controller,
} from "./types";

declare module "mercurius" {
  interface MercuriusContext {
    roles: string[] | undefined;
    user: User | undefined;
  }
}

declare module "@dzangolab/fastify-config" {
  interface ApiConfig {
    user: {
      email?: IsEmailOptions;
      graphql?: {
        resolver?: {
          mutation?: Resolver;
          query?: Resolver;
        };
      };
      password?: StrongPasswordOptions;
      rest?: {
        handlers?: Controller;
      };
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
