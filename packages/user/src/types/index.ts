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

interface UserProfile {
  id: string;
}

type UserProfileCreateInput = Partial<UserProfile>;

type UserProfileUpdateInput = Partial<Omit<UserProfile, "id">>;

interface User extends SupertokensUser {
  profile: UserProfile | null;
  roles: string[];
}

export type {
  ChangePasswordInput,
  EmailErrorMessages,
  PasswordErrorMessages,
  User,
  UserProfile,
  UserProfileCreateInput,
  UserProfileUpdateInput,
};

export type { IsEmailOptions } from "./isEmailOptions";

export type { StrongPasswordOptions } from "./strongPasswordOptions";
