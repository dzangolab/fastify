import type { FilterInput, SortInput } from "@dzangolab/fastify-slonik";
import type { MercuriusContext } from "mercurius";
declare const _default: {
    Mutation: {
        createTenant: (parent: unknown, arguments_: {
            data: {
                id: string;
                password: string;
            };
        }, context: MercuriusContext) => Promise<import("slonik").QueryResultRow | import("mercurius").ErrorWithProps | undefined>;
    };
    Query: {
        allTenants: (parent: unknown, arguments_: {
            fields: string[];
        }, context: MercuriusContext) => Promise<readonly import("slonik").QueryResultRow[] | import("mercurius").ErrorWithProps>;
        tenant: (parent: unknown, arguments_: {
            id: number;
        }, context: MercuriusContext) => Promise<import("slonik").QueryResultRow | import("mercurius").ErrorWithProps | null>;
        tenants: (parent: unknown, arguments_: {
            limit: number;
            offset: number;
            filters?: FilterInput | undefined;
            sort?: SortInput[] | undefined;
        }, context: MercuriusContext) => Promise<import("mercurius").ErrorWithProps | import("@dzangolab/fastify-slonik/dist/types/types/service").PaginatedList<import("slonik").QueryResultRow>>;
    };
};
export default _default;
//# sourceMappingURL=resolver.d.ts.map