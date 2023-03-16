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
interface changePassword {
    oldPassword?: string;
    newPassword?: string;
}
export type { UserProfile, UserProfileCreateInput, UserProfileUpdateInput, User, changePassword, };
//# sourceMappingURL=types.d.ts.map