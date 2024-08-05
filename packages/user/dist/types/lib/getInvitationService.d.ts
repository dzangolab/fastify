import InvitationService from "../model/invitations/service";
import type { Invitation, InvitationCreateInput } from "../types/invitation";
import type { ApiConfig } from "@dzangolab/fastify-config";
import type { Database } from "@dzangolab/fastify-slonik";
import type { QueryResultRow } from "slonik";
declare const getInvitationService: (config: ApiConfig, slonik: Database, dbSchema?: string) => InvitationService<Invitation & QueryResultRow, InvitationCreateInput, Partial<Omit<Invitation, "payload" | "email" | "acceptedAt" | "expiresAt" | "revokedAt" | "id" | "invitedBy" | "token" | "createdAt" | "updatedAt" | "appId" | "invitedById" | "role"> & {
    acceptedAt: string;
    expiresAt: string;
    revokedAt: string;
}>>;
export default getInvitationService;
//# sourceMappingURL=getInvitationService.d.ts.map