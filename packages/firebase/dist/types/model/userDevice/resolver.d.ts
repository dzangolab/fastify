import { MercuriusContext } from "mercurius";
declare const _default: {
    Mutation: {
        addUserDevice: (parent: unknown, arguments_: {
            data: {
                deviceToken: string;
            };
        }, context: MercuriusContext) => Promise<import("slonik").QueryResultRow | import("mercurius").ErrorWithProps | undefined>;
        removeUserDevice: (parent: unknown, arguments_: {
            data: {
                deviceToken: string;
            };
        }, context: MercuriusContext) => Promise<import("slonik").QueryResultRow | import("mercurius").ErrorWithProps | undefined>;
    };
    Query: {};
};
export default _default;
//# sourceMappingURL=resolver.d.ts.map