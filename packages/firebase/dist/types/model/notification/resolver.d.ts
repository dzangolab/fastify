import type { MercuriusContext } from "mercurius";
declare const _default: {
    Mutation: {
        sendNotification: (parent: unknown, arguments_: {
            data: {
                userId: string;
                title: string;
                body: string;
                data: {
                    [key: string]: string;
                };
            };
        }, context: MercuriusContext) => Promise<import("mercurius").ErrorWithProps | {
            message: string;
        }>;
    };
    Query: {};
};
export default _default;
//# sourceMappingURL=resolver.d.ts.map