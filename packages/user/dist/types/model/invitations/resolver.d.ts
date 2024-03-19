import mercurius from "mercurius";
import type { Invitation, InvitationCreateInput } from "../../types/invitation";
import type { FilterInput, SortInput } from "@dzangolab/fastify-slonik";
import type { MercuriusContext } from "mercurius";
declare const _default: {
    Mutation: {
        acceptInvitation: (parent: unknown, arguments_: {
            data: {
                email: string;
                password: string;
            };
            token: string;
        }, context: MercuriusContext) => Promise<{
            status: "EMAIL_ALREADY_EXISTS_ERROR";
        } | mercurius.ErrorWithProps | {
            user: {
                roles: string[];
                id: string;
                timeJoined: number;
                email: string;
                thirdParty?: {
                    id: string;
                    userId: string;
                } | undefined;
                tenantIds: string[];
            };
            status: "OK";
        }>;
        createInvitation: (parent: unknown, arguments_: {
            data: InvitationCreateInput;
        }, context: MercuriusContext) => Promise<Invitation | mercurius.ErrorWithProps | undefined>;
        resendInvitation: (parent: unknown, arguments_: {
            id: number;
        }, context: MercuriusContext) => Promise<(Invitation & import("slonik").QueryResultRow) | mercurius.ErrorWithProps>;
        revokeInvitation: (parent: unknown, arguments_: {
            id: number;
        }, context: MercuriusContext) => Promise<(Invitation & import("slonik").QueryResultRow) | mercurius.ErrorWithProps>;
    };
    Query: {
        getInvitationByToken: (parent: unknown, arguments_: {
            token: string;
        }, context: MercuriusContext) => Promise<(Invitation & import("slonik").QueryResultRow) | mercurius.ErrorWithProps | null>;
        invitations: (parent: unknown, arguments_: {
            limit: number;
            offset: number;
            filters?: FilterInput | undefined;
            sort?: SortInput[] | undefined;
        }, context: MercuriusContext) => Promise<import("@dzangolab/fastify-slonik/dist/types/types/service").PaginatedList<Invitation & import("slonik").QueryResultRow>>;
    };
};
export default _default;
//# sourceMappingURL=resolver.d.ts.map