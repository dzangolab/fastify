import type { FilterInput, SortInput } from "@dzangolab/fastify-slonik";
import type { MercuriusContext } from "mercurius";
declare const _default: {
    Query: {
        user: (parent: unknown, arguments_: {
            id: string;
        }, context: MercuriusContext) => Promise<import("slonik").QueryResultRow | null>;
        users: (parent: unknown, arguments_: {
            limit: number;
            offset: number;
            filters?: FilterInput | undefined;
            sort?: SortInput[] | undefined;
        }, context: MercuriusContext) => Promise<readonly import("slonik").QueryResultRow[]>;
    };
};
export default _default;
//# sourceMappingURL=resolver.d.ts.map