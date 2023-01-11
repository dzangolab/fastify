import type { MercuriusContext } from "mercurius";
declare const _default: {
    Query: {
        user: (parent: unknown, arguments_: {
            id: string;
        }, context: MercuriusContext) => Promise<import("../..").User | null>;
        users: (parent: unknown, arguments_: {
            limit: number;
            offset: number;
        }, context: MercuriusContext) => Promise<readonly import("../..").User[]>;
    };
};
export default _default;
//# sourceMappingURL=resolver.d.ts.map