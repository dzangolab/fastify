interface Invitation {
  id: number;
  acceptedAt: string;
  appId: number;
  email: string;
  expiresAt: string;
  invitedById: string;
  payload: Record<string, unknown>;
  revokedAt: string;
  role: string;
  token: string;
  createdAt: string;
  updatedAt: string;
}

type InvitationCreateInput = Pick<
  Invitation,
  "appId" | "email" | "expiresAt" | "invitedById" | "role"
> & { payload?: string };

type InvitationInput = Pick<
  Invitation,
  "appId" | "email" | "expiresAt" | "payload" | "role"
>;

type InvitationUpdateInput = Pick<
  Invitation,
  "acceptedAt" | "expiresAt" | "revokedAt" | "role"
>;

export type {
  Invitation,
  InvitationCreateInput,
  InvitationInput,
  InvitationUpdateInput,
};
