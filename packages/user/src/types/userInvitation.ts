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

type UserInvitationCreateInput = Omit<
  UserInvitation,
  "id" | "accepted" | "token" | "createdAt" | "updatedAt"
>;

type userInvitationUpdateInput = Pick<UserInvitation, "role" | "accepted">;

export type {
  UserInvitation,
  UserInvitationCreateInput,
  userInvitationUpdateInput,
};
