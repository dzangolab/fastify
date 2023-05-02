import { PaginatedList } from "@dzangolab/fastify-slonik";
import { MercuriusContext } from "mercurius";
import { QueryResultRow } from "slonik";
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

interface resolver {
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
  EmailErrorMessages,
  PasswordErrorMessages,
  resolver,
  User,
  UserCreateInput,
  UserUpdateInput,
};

export type { IsEmailOptions } from "./isEmailOptions";

export type { StrongPasswordOptions } from "./strongPasswordOptions";
