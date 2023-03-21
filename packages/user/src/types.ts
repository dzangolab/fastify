import type { User as SupertokensUser } from "supertokens-node/recipe/thirdpartyemailpassword";

interface UserProfile {
  email: string;
  givenName?: string;
  id: string;
  middleNames?: string;
  surname?: string;
}

type UserProfileCreateInput = Partial<UserProfile>;

type UserProfileUpdateInput = Partial<Omit<UserProfile, "id">>;

interface User extends SupertokensUser {
  profile: UserProfile;
  roles: string[];
}

interface changePassword {
  oldPassword?: string;
  newPassword?: string;
}

export type {
  UserProfile,
  UserProfileCreateInput,
  UserProfileUpdateInput,
  User,
  changePassword,
};
