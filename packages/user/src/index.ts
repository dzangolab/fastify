import "@dzangolab/fastify-mercurius";

import type { SupertokensConfig } from "./supertokens";
import type {
  Handler,
  IsEmailOptions,
  StrongPasswordOptions,
  User,
} from "./types";
import type { Invitation } from "./types/invitation";
import type { FastifyRequest } from "fastify";

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
        handlers?: {
          accept?: Handler;
          create?: Handler;
          getByToken: Handler;
          list?: Handler;
          resend?: Handler;
          revoke?: Handler;
        };
      };
      email?: IsEmailOptions;
      password?: StrongPasswordOptions;
      supertokens: SupertokensConfig;
      table?: {
        name?: string;
      };
      features?: {
        signUp?: {
          /**
           * @default true
           */
          enabled?: boolean;
          /**
           * @default false
           */
          emailVerification?: boolean;
        };
      };
      role?: string;
    };
  }
}

export { default } from "./plugin";

export { default as userResolver } from "./model/users/resolver";
export { default as userSqlFactory } from "./model/users/sqlFactory";
export { default as UserService } from "./model/users/service";
export { default as userRoutes } from "./model/users/controller";
export { default as invitationResolver } from "./model/invitations/resolver";
export { default as invitationSqlFactory } from "./model/invitations/sqlFactory";
export { default as InvitationService } from "./model/invitations/service";
export { default as invitationRoutes } from "./model/invitations/controller";
// [DU 2023-AUG-07] use formatDate from  "@dzangolab/fastify-slonik" package
export { formatDate } from "@dzangolab/fastify-slonik";
export { default as computeInvitationExpiresAt } from "./lib/computeInvitationExpiresAt";
export { default as getOrigin } from "./lib/getOrigin";
export { default as isInvitationValid } from "./lib/isInvitationValid";
export { default as sendEmail } from "./lib/sendEmail";
export { default as sendInvitation } from "./lib/sendInvitation";
export { default as verifyEmail } from "./lib/verifyEmail";
export { default as isRoleExists } from "./supertokens/utils/isRoleExists";
export { default as areRolesExist } from "./supertokens/utils/areRolesExist";
export { default as validateEmail } from "./validator/email";
export { default as validatePassword } from "./validator/password";

export * from "./constants";

export type {
  EmailVerificationRecipe,
  ThirdPartyEmailPasswordRecipe,
} from "./supertokens/types";
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
