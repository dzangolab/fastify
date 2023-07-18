interface Invitation {
  id: number;
  acceptedAt?: string;
  appId?: number;
  email: string;
  expiresAt: string;
  invitedById: string;
  payload?: Record<string, unknown>;
  revokedAt?: string;
  role: string;
  token: string;
  createdAt: string;
  updatedAt: string;
}

type InvitationCreateInput = Omit<
  Invitation,
  | "id"
  | "acceptedAt"
  | "payload"
  | "revokedAt"
  | "token"
  | "createdAt"
  | "updatedAt"
> & { payload?: string };

type InvitationUpdateInput = Partial<
  Omit<
    Invitation,
    | "id"
    | "appId"
    | "email"
    | "invitedById"
    | "payload"
    | "role"
    | "token"
    | "createdAt"
    | "updatedAt"
  >
>;

export type { Invitation, InvitationCreateInput, InvitationUpdateInput };
