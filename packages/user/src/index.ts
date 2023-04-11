import "@dzangolab/fastify-mercurius";

import type { SupertokensConfig } from "./supertokens";
import type { IsEmailOptions, StrongPasswordOptions, User } from "./types";

declare module "mercurius" {
  interface MercuriusContext {
    user: User | undefined;
  }
}
declare module "@dzangolab/fastify-config" {
  interface ApiConfig {
    user: {
      email?: IsEmailOptions;
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
