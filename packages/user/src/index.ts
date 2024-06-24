import "@dzangolab/fastify-mercurius";

import hasPermission from "./middlewares/hasPermission";
import invitationHandlers from "./model/invitations/handlers";
import InvitationService from "./model/invitations/service";
import userHandlers from "./model/users/handlers";
import UserService from "./model/users/service";

import type { SupertokensConfig } from "./supertokens";
import type {
  IsEmailOptions,
  StrongPasswordOptions,
  User,
  UserUpdateInput,
} from "./types";
import type { Invitation } from "./types/invitation";
import type { FastifyRequest } from "fastify";

declare module "fastify" {
  interface FastifyInstance {
    hasPermission: typeof hasPermission;
  }

  interface FastifyRequest {
    user?: User;
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
        acceptLinkPath?: string;
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
          delete?: typeof invitationHandlers.deleteInvitation;
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
          user?: typeof userHandlers.user;
          users?: typeof userHandlers.users;
        };
      };
      password?: StrongPasswordOptions;
      permissions?: string[];
      services?: {
        invitation?: typeof InvitationService;
        user?: typeof UserService;
      };
      supertokens: SupertokensConfig;
      table?: {
        name?: string;
      };
      features?: {
        profileValidation?: {
          /**
           * @default false
           */
          enabled?: boolean;
          fields?: Array<keyof UserUpdateInput>;
          /**
           * Number of days in which grace period expire.
           * @default undefined
           */
          gracePeriodInDays?: number;
        };
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
export { default as getUserService } from "./lib/getUserService";
export { default as userRoutes } from "./model/users/controller";
export { default as invitationResolver } from "./model/invitations/resolver";
export { default as InvitationSqlFactory } from "./model/invitations/sqlFactory";
export { default as InvitationService } from "./model/invitations/service";
export { default as getInvitationService } from "./lib/getInvitationService";
export { default as invitationRoutes } from "./model/invitations/controller";
export { default as permissionResolver } from "./model/permissions/resolver";
export { default as permissionRoutes } from "./model/permissions/controller";
export { default as RoleService } from "./model/roles/service";
export { default as roleResolver } from "./model/roles/resolver";
export { default as roleRoutes } from "./model/roles/controller";
// [DU 2023-AUG-07] use formatDate from "@dzangolab/fastify-slonik" package
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
export { default as hasUserPermission } from "./lib/hasUserPermission";
export { default as ProfileValidationClaim } from "./supertokens/utils/profileValidationClaim";
export { default as createUserContext } from "./supertokens/utils/createUserContext";
export { default as userSchema } from "./graphql/schema";

export * from "./constants";

export type { EmailVerificationRecipe } from "./supertokens/types/emailVerificationRecipe";
export type { SessionRecipe } from "./supertokens/types/sessionRecipe";
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
