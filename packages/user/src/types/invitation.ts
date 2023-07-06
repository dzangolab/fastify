interface Invitation {
  id: number;
  acceptedAt: string;
  appId: number;
  email: string;
  expiresAt: string;
  invitedById: string;
  payload: string;
  revokedAt: string;
  role: string;
  token: string;
  createdAt: string;
  updatedAt: string;
}

type InvitationCreateInput = Pick<
  Invitation,
  | "appId"
  | "email"
  | "expiresAt"
  | "invitedById"
  | "payload"
  | "revokedAt"
  | "role"
>;

type InvitationInput = Pick<
  Invitation,
  | "appId"
  | "email"
  | "expiresAt"
  | "expiresAt"
  | "invitedById"
  | "payload"
  | "role"
>;

type InvitationUpdateInput = Pick<
  Invitation,
  "acceptedAt" | "expiresAt" | "invitedById" | "revokedAt" | "role"
>;

export type {
  Invitation,
  InvitationCreateInput,
  InvitationInput,
  InvitationUpdateInput,
};
