import type { User as SupertokensUser } from "supertokens-node/recipe/thirdpartyemailpassword";

interface User {
  id: string;
  disabled: boolean;
  email: string;
  lastLoginAt: number;
  roles?: string[];
  signedUpAt: number;
}

type UserCreateInput = Partial<
  Omit<User, "disabled" | "lastLoginAt" | "roles" | "signedUpAt">
> & {
  lastLoginAt?: string;
  signedUpAt?: string;
};

type UserUpdateInput = Partial<
  Omit<User, "id" | "lastLoginAt" | "roles" | "signedUpAt">
> & {
  lastLoginAt?: string;
  email?: string;
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface AuthUser extends User, SupertokensUser {}

export type { AuthUser, User, UserCreateInput, UserUpdateInput };
