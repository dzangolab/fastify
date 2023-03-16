import mercurius from "mercurius";
import type { MercuriusContext } from "mercurius";
declare const _default: {
    Mutation: {
        changePassword: (parent: unknown, arguments_: {
            oldPassword: string;
            newPassword: string;
        }, context: MercuriusContext) => Promise<mercurius.ErrorWithProps | {
            status: string;
            message: string;
        } | {
            status: string;
            message?: undefined;
        }>;
    };
    Query: {
        me: (parent: unknown, arguments_: unknown, context: MercuriusContext) => Promise<mercurius.ErrorWithProps | {
            email: string | undefined;
            id: string;
            profile: import("../../types").UserProfile | null;
            roles: string[];
            timeJoined: number | undefined;
        }>;
    };
};
export default _default;
//# sourceMappingURL=resolver.d.ts.map