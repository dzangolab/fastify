import mercurius from "mercurius";
import type { FilterInput, SortInput } from "@dzangolab/fastify-slonik";
import type { MercuriusContext } from "mercurius";
declare const _default: {
    Mutation: {
        changePassword: (parent: unknown, arguments_: {
            oldPassword: string;
            newPassword: string;
        }, context: MercuriusContext) => Promise<mercurius.ErrorWithProps | {
            status: string;
            message: string | undefined;
        } | {
            status: string;
            message?: undefined;
        }>;
    };
    Query: {
        me: (parent: unknown, arguments_: Record<string, never>, context: MercuriusContext) => Promise<import("slonik").QueryResultRow | mercurius.ErrorWithProps | null>;
        user: (parent: unknown, arguments_: {
            id: string;
        }, context: MercuriusContext) => Promise<import("slonik").QueryResultRow | null>;
        users: (parent: unknown, arguments_: {
            limit: number;
            offset: number;
            filters?: FilterInput | undefined;
            sort?: SortInput[] | undefined;
        }, context: MercuriusContext) => Promise<import("@dzangolab/fastify-slonik/dist/types/types/service").PaginatedList<import("slonik").QueryResultRow>>;
    };
};
export default _default;
//# sourceMappingURL=resolver.d.ts.map