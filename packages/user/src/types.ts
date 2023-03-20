import type { User as SupertokensUser } from "supertokens-node/recipe/thirdpartyemailpassword";

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

interface ChangePasswordInput {
  oldPassword?: string;
  newPassword?: string;
}

export type {
  ChangePasswordInput,
  UserProfile,
  UserProfileCreateInput,
  UserProfileUpdateInput,
  User,
};
