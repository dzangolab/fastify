import "@dzangolab/fastify-mercurius";

import type { SupertokensConfig } from "./supertokens";
import type { IsEmailOptions, StrongPasswordOptions, User } from "./types";
import type { ServerResponse } from "node:http";

declare module "fastify" {
  interface FastifyReply {
    setHeader: ServerResponse["setHeader"];
  }
}

declare module "mercurius" {
  interface MercuriusContext {
    roles: string[] | undefined;
    user: User | undefined;
  }
}

declare module "@dzangolab/fastify-config" {
  interface ApiConfig {
    user: {
      invitation?: {
        /**
         * Number of days in which invitation expire.
         * @default 30
         */
        expireAfterInDays?: number;
      };
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

export { default as userResolver } from "./model/users/resolver";
export { default as UserService } from "./model/users/service";
export { default as userRoutes } from "./model/users/controller";
export { default as invitationRoutes } from "./model/invitations/controller";
export { default as formatDate } from "./supertokens/utils/formatDate";
export { default as isRoleExists } from "./supertokens/utils/isRoleExists";
export { default as validateEmail } from "./validator/email";
export { default as validatePassword } from "./validator/password";

export type { ThirdPartyEmailPasswordRecipe } from "./supertokens/types";
export type {
  AuthUser,
  ChangePasswordInput,
  UserCreateInput,
  UserUpdateInput,
  User,
} from "./types";
