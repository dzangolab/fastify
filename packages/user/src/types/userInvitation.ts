interface UserInvitation {
  id: number;
  accepted: boolean;
  email: string;
  invitedBy: string;
  role: string;
  token: string;
  createdAt: string;
  updatedAt: string;
}

type UserInvitationCreateInput = Pick<
  UserInvitation,
  "email" | "invitedBy" | "role" | "token"
>;

type userInvitationUpdateInput = Pick<UserInvitation, "role" | "accepted">;

export type {
  UserInvitation,
  UserInvitationCreateInput,
  userInvitationUpdateInput,
};
