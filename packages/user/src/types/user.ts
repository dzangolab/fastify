import type { User as SupertokensUser } from "supertokens-node/recipe/thirdpartyemailpassword";

interface User {
  id: string;
  deletedAt?: number;
  disabled: boolean;
  email: string;
  lastLoginAt: number;
  roles?: string[];
  signedUpAt: number;
}

type UserCreateInput = Partial<
  Omit<User, "disabled" | "lastLoginAt" | "roles" | "signedUpAt" | "deletedAt">
> & {
  lastLoginAt?: string;
  signedUpAt?: string;
};

type UserUpdateInput = Partial<
  Omit<
    User,
    "id" | "email" | "lastLoginAt" | "roles" | "signedUpAt" | "deletedAt"
  >
> & {
  lastLoginAt?: string;
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface AuthUser extends User, SupertokensUser {}

export type { AuthUser, User, UserCreateInput, UserUpdateInput };
