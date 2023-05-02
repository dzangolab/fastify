import type { PaginatedList } from "@dzangolab/fastify-slonik";
import type { FastifyReply } from "fastify";
import type { MercuriusContext } from "mercurius";
import type { QueryResultRow } from "slonik";
import type { SessionRequest } from "supertokens-node/framework/fastify";
import type { User as SupertokensUser } from "supertokens-node/recipe/thirdpartyemailpassword";

interface ChangePasswordInput {
  oldPassword?: string;
  newPassword?: string;
}

interface Controller {
  [key: string]: (
    request: SessionRequest,
    reply: FastifyReply
  ) => Promise<void>;
}

interface EmailErrorMessages {
  invalid?: string;
  required?: string;
}

interface PasswordErrorMessages {
  required?: string;
  weak?: string;
}

interface Resolver {
  [key: string]: (
    parent: unknown,
    argyments_: {
      [key: string]: unknown;
    },
    context: MercuriusContext
  ) => Promise<QueryResultRow | null | PaginatedList<QueryResultRow>>;
}

interface User {
  id: string;
  email: string;
  signedUpAt: number;
  lastLoginAt: number;
}

type UserCreateInput = Partial<User>;

type UserUpdateInput = Partial<Omit<User, "id">>;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface AuthUser extends User, SupertokensUser {}

export type {
  AuthUser,
  ChangePasswordInput,
  Controller,
  EmailErrorMessages,
  PasswordErrorMessages,
  Resolver,
  User,
  UserCreateInput,
  UserUpdateInput,
};

export type { IsEmailOptions } from "./isEmailOptions";

export type { StrongPasswordOptions } from "./strongPasswordOptions";
