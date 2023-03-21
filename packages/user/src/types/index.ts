import type { User as SupertokensUser } from "supertokens-node/recipe/thirdpartyemailpassword";

interface changePassword {
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
  givenName: string;
  id: string;
  middleNames?: string;
  surname?: string;
}

type UserProfileCreateInput = Omit<UserProfile, "id">;

type UserProfileUpdateInput = Partial<Omit<UserProfile, "id">>;

interface User extends SupertokensUser {
  profile: UserProfile | null;
  roles: string[];
}

export type {
  changePassword,
  EmailErrorMessages,
  PasswordErrorMessages,
  UserProfile,
  UserProfileCreateInput,
  UserProfileUpdateInput,
  User,
};

export type { IsEmailOptions } from "./isEmailOptions";

export type { StrongPasswordOptions } from "./strongPasswordOptions";
