interface Invitation {
  id: number;
  acceptedAt?: number;
  appId?: number;
  email: string;
  expiresAt: number;
  invitedById: string;
  payload?: Record<string, unknown>;
  revokedAt?: number;
  role: string;
  token: string;
  createdAt: number;
  updatedAt: number;
}

type InvitationCreateInput = Omit<
  Invitation,
  | "id"
  | "acceptedAt"
  | "expiresAt"
  | "payload"
  | "revokedAt"
  | "token"
  | "createdAt"
  | "updatedAt"
> & {
  expiresAt: string;
  payload?: string;
};

type InvitationUpdateInput = Partial<
  Omit<
    Invitation,
    | "id"
    | "acceptedAt"
    | "appId"
    | "email"
    | "expiresAt"
    | "invitedById"
    | "payload"
    | "revokedAt"
    | "role"
    | "token"
    | "createdAt"
    | "updatedAt"
  > & {
    acceptedAt: string;
    expiresAt: string;
    revokedAt: string;
  }
>;

export type { Invitation, InvitationCreateInput, InvitationUpdateInput };
