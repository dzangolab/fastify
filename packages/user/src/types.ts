interface UserProfile {
  givenName: string;
  id: string;
  middleNames?: string;
  surname?: string;
}

type UserProfileCreateInput = Omit<UserProfile, "id">;

type UserProfileUpdateInput = Partial<Omit<UserProfile, "id">>;

export type { UserProfile, UserProfileCreateInput, UserProfileUpdateInput };
