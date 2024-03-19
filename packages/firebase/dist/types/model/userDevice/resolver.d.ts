import mercurius, { MercuriusContext } from "mercurius";
import "@dzangolab/fastify-mercurius";
declare const _default: {
    Mutation: {
        addUserDevice: (parent: unknown, arguments_: {
            data: {
                deviceToken: string;
            };
        }, context: MercuriusContext) => Promise<import("slonik").QueryResultRow | mercurius.ErrorWithProps | undefined>;
        removeUserDevice: (parent: unknown, arguments_: {
            data: {
                deviceToken: string;
            };
        }, context: MercuriusContext) => Promise<import("slonik").QueryResultRow | mercurius.ErrorWithProps | undefined>;
    };
    Query: {};
};
export default _default;
//# sourceMappingURL=resolver.d.ts.map