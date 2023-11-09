import "@dzangolab/fastify-mercurius";

import invitationHandlers from "./model/invitations/handlers";
import InvitationService from "./model/invitations/service";
import userHandlers from "./model/users/handlers";

import type { SupertokensConfig } from "./supertokens";
import type { IsEmailOptions, StrongPasswordOptions, User } from "./types";
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
      };
      email?: IsEmailOptions;
      handlers?: {
        invitation?: {
          accept?: typeof invitationHandlers.acceptInvitation;
          create?: typeof invitationHandlers.createInvitation;
          getByToken?: typeof invitationHandlers.getInvitationByToken;
          list?: typeof invitationHandlers.listInvitation;
          resend?: typeof invitationHandlers.resendInvitation;
          revoke?: typeof invitationHandlers.revokeInvitation;
        };
        user?: {
          adminSignUp?: typeof userHandlers.adminSignUp;
          canAdminSignUp?: typeof userHandlers.canAdminSignUp;
          changePassword?: typeof userHandlers.changePassword;
          disable?: typeof userHandlers.disable;
          enable?: typeof userHandlers.enable;
          me?: typeof userHandlers.me;
          updateMe?: typeof userHandlers.updateMe;
          users?: typeof userHandlers.users;
        };
      };
      password?: StrongPasswordOptions;
      services?: {
        invitation?: typeof InvitationService;
      };
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
export { default as UserSqlFactory } from "./model/users/sqlFactory";
export { default as UserService } from "./model/users/service";
export { default as userRoutes } from "./model/users/controller";
export { default as invitationResolver } from "./model/invitations/resolver";
export { default as InvitationSqlFactory } from "./model/invitations/sqlFactory";
export { default as InvitationService } from "./model/invitations/service";
export { default as getInvitationService } from "./lib/getInvitationService";
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

export type { EmailVerificationRecipe } from "./supertokens/types/emailVerificationRecipe";
export type { ThirdPartyEmailPasswordRecipe } from "./supertokens/types/thirdPartyEmailPasswordRecipe";
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
