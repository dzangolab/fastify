import "@dzangolab/fastify-mercurius";

import type { SupertokensConfig } from "./supertokens";
import type {
  IsEmailOptions,
  StrongPasswordOptions,
  User,
  Resolver,
} from "./types";
import type { RouteHandler } from "fastify";

declare module "fastify" {
  interface FastifyRequest {
    schema?: string;
  }
}

declare module "mercurius" {
  interface MercuriusContext {
    roles: string[] | undefined;
    schema?: string;
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
        handlers?: {
          [key: string]: RouteHandler;
        };
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
export type {
  AuthUser,
  ChangePasswordInput,
  UserCreateInput,
  UserUpdateInput,
  User,
} from "./types";
