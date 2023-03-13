import type { User as SupertokensUser } from "supertokens-node/recipe/thirdpartyemailpassword";

type Tenant = Record<string, string>;

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

interface changePassword {
  oldPassword?: string;
  newPassword?: string;
}

export type {
  Tenant,
  UserProfile,
  UserProfileCreateInput,
  UserProfileUpdateInput,
  User,
  changePassword,
};
