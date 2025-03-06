import invitationHandlers from "../model/invitations/handlers";
import InvitationService from "../model/invitations/service";
import userHandlers from "../model/users/handlers";
import UserService from "../model/users/service";

import type { SupertokensConfig } from "../supertokens";
import type { Invitation } from "./invitation";
import type { IsEmailOptions } from "./isEmailOptions";
import type { StrongPasswordOptions } from "./strongPasswordOptions";
import type { User, UserUpdateInput } from "./user";
import type { FastifyRequest } from "fastify";

interface EmailOptions {
  subject?: string;
  templateName?: string;
}
interface UserConfig {
  emails?: {
    duplicateEmail?: EmailOptions;
    emailVerification?: EmailOptions;
    invitation?: EmailOptions;
    resetPassword?: EmailOptions;
    resetPasswordNotification?: EmailOptions;
  };
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
      user: User,
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
  routes?: {
    invitations?: {
      disabled: boolean;
    };
    permissions?: {
      disabled: boolean;
    };
    roles?: {
      disabled: boolean;
    };
    users?: {
      disabled: boolean;
    };
  };
  routePrefix?: string;
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
    updateEmail?: {
      enabled?: boolean;
    };
  };
  role?: string;
}

export type { UserConfig };
