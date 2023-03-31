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

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface User extends SupertokensUser {}

type UserCreateInput = Omit<User, "timeJoined" | "thirdParty">;

type UserUpdateInput = Omit<User, "id" | "timeJoined" | "thirdParty">;

export type {
  ChangePasswordInput,
  EmailErrorMessages,
  PasswordErrorMessages,
  User,
  UserCreateInput,
  UserUpdateInput,
};

export type { IsEmailOptions } from "./isEmailOptions";

export type { StrongPasswordOptions } from "./strongPasswordOptions";
