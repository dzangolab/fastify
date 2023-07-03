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

type UserInvitationInput = Pick<UserInvitation, "email" | "role">;

type UserInvitationUpdateInput = Pick<
  UserInvitation,
  "email" | "invitedBy" | "role"
>;

export type {
  UserInvitation,
  UserInvitationCreateInput,
  UserInvitationInput,
  UserInvitationUpdateInput,
};
