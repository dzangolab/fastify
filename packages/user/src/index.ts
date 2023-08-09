import "@dzangolab/fastify-mercurius";

import type { SupertokensConfig } from "./supertokens";
import type { IsEmailOptions, StrongPasswordOptions, User } from "./types";
import type { Invitation } from "./types/invitation";
import type { FastifyRequest } from "fastify";
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
        postAccept?: (
          request: FastifyRequest,
          invitation: Invitation,
          user: User
        ) => Promise<void>;
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
export { default as invitationResolver } from "./model/invitations/resolver";
export { default as InvitationService } from "./model/invitations/service";
export { default as invitationRoutes } from "./model/invitations/controller";
// [DU 2023-AUG-07] use formatDate from  "@dzangolab/fastify-slonik" package
export { formatDate } from "@dzangolab/fastify-slonik";
export { default as getOrigin } from "./lib/getOrigin";
export { default as sendEmail } from "./lib/sendEmail";
export { default as isRoleExists } from "./supertokens/utils/isRoleExists";
export { default as areRolesExist } from "./supertokens/utils/areRolesExist";
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
export type {
  Invitation,
  InvitationCreateInput,
  InvitationUpdateInput,
} from "./types/invitation";
