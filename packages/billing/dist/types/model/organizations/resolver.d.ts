import type { FilterInput, SortInput } from "@dzangolab/fastify-slonik";
import type { MercuriusContext } from "mercurius";
declare const _default: {
    Mutation: {
        createOrganization: (parent: unknown, arguments_: {
            data: Partial<Omit<import("../../types").Organization, "id">>;
        }, context: MercuriusContext) => Promise<Partial<Omit<import("../../types").Organization, "id">> | undefined>;
        deleteOrganization: (parent: unknown, arguments_: {
            id: number;
        }, context: MercuriusContext) => Promise<import("slonik").QueryResultRow | null | undefined>;
        updateOrganization: (parent: unknown, arguments_: {
            id: number;
            data: Partial<Omit<import("../../types").Organization, "id" | "name" | "schema" | "tenant">>;
        }, context: MercuriusContext) => Promise<import("slonik").QueryResultRow | undefined>;
    };
    Query: {
        organization: (parent: unknown, arguments_: {
            id: number;
        }, context: MercuriusContext) => Promise<import("slonik").QueryResultRow | null>;
        organizations: (parent: unknown, arguments_: {
            limit: number;
            offset: number;
            filters?: FilterInput | undefined;
            sort?: SortInput[] | undefined;
        }, context: MercuriusContext) => Promise<import("@dzangolab/fastify-slonik/dist/types/types/service").PaginatedList<import("slonik").QueryResultRow>>;
    };
};
export default _default;
//# sourceMappingURL=resolver.d.ts.map