interface Invitation {
  id: number;
  accepted: boolean;
  email: string;
  invitedBy: string;
  role: string;
  token: string;
  createdAt: string;
  updatedAt: string;
}

type InvitationCreateInput = Pick<
  Invitation,
  "email" | "invitedBy" | "role" | "token"
>;

type InvitationInput = Pick<Invitation, "email" | "role">;

type InvitationUpdateInput = Pick<Invitation, "email" | "invitedBy" | "role">;

export type {
  Invitation,
  InvitationCreateInput,
  InvitationInput,
  InvitationUpdateInput,
};
