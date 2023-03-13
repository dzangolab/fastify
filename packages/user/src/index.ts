import "@dzangolab/fastify-mercurius";

import type { SupertokensConfig } from "./supertokens";
import type { User } from "./types";

declare module "mercurius" {
  interface MercuriusContext {
    tenant?: Tenant;
    user: User | undefined;
  }
}
declare module "@dzangolab/fastify-config" {
  interface ApiConfig {
    multiTenant?: {
      table?: {
        columns?: {
          id?: string;
        };
      };
    };
    user: {
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

declare module "fastify" {
  interface FastifyRequest {
    tenant?: Tenant;
  }
}

type Tenant = Record<string, string>;

export type { Tenant };

export { default } from "./plugin";

export type {
  UserProfile,
  UserProfileCreateInput,
  UserProfileUpdateInput,
  User,
} from "./types";

export { default as userProfileResolver } from "./model/user-profiles/resolver";
export { default as UserProfileService } from "./model/user-profiles/service";
export { default as userProfileRoutes } from "./model/user-profiles/controller";

export { default as userResolver } from "./model/users/resolver";
export { default as UserService } from "./model/users/service";
export { default as userRoutes } from "./model/users/controller";
