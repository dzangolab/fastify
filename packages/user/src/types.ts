import type { User as SupertokensUser } from "supertokens-node/recipe/thirdpartyemailpassword";

interface UserProfile {
  email: string;
  id: string;
}

type UserProfileCreateInput = Partial<UserProfile>;

type UserProfileUpdateInput = Partial<Omit<UserProfile, "id">>;

interface User extends SupertokensUser {
  profile: UserProfile;
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
