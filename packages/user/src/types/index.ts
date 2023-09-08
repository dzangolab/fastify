import type { PaginatedList } from "@dzangolab/fastify-slonik";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { MercuriusContext } from "mercurius";
import type { QueryResultRow } from "slonik";
import type { SessionRequest } from "supertokens-node/framework/fastify";
import type { User as SupertokensUser } from "supertokens-node/recipe/thirdpartyemailpassword";

interface ChangePasswordInput {
  oldPassword?: string;
  newPassword?: string;
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
  lastLoginAt: number;
  roles?: string[];
  signedUpAt: number;
}

type UserCreateInput = Partial<
  Omit<User, "lastLoginAt" | "roles" | "signedUpAt">
> & {
  lastLoginAt?: string;
  signedUpAt?: string;
};

type UserUpdateInput = Partial<
  Omit<User, "id" | "lastLoginAt" | "roles" | "signedUpAt">
> & {
  lastLoginAt?: string;
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface AuthUser extends User, SupertokensUser {}

type Handler = (
  request: FastifyRequest | SessionRequest,
  reply: FastifyReply
) => Promise<FastifyReply | undefined>;

export type {
  AuthUser,
  ChangePasswordInput,
  EmailErrorMessages,
  Handler,
  PasswordErrorMessages,
  Resolver,
  User,
  UserCreateInput,
  UserUpdateInput,
};

export type { IsEmailOptions } from "./isEmailOptions";

export type { StrongPasswordOptions } from "./strongPasswordOptions";
