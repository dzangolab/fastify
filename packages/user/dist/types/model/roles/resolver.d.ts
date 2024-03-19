import mercurius from "mercurius";
import type { MercuriusContext } from "mercurius";
declare const _default: {
    Mutation: {
        createRole: (parent: unknown, arguments_: {
            role: string;
        }, context: MercuriusContext) => Promise<string | mercurius.ErrorWithProps>;
        updateRolePermissions: (parent: unknown, arguments_: {
            role: string;
            permissions: string[];
        }, context: MercuriusContext) => Promise<string[] | mercurius.ErrorWithProps>;
    };
    Query: {
        roles: (parent: unknown, arguments_: Record<string, never>, context: MercuriusContext) => Promise<string[] | mercurius.ErrorWithProps>;
        rolePermissions: (parent: unknown, arguments_: {
            role: string;
        }, context: MercuriusContext) => Promise<string[] | mercurius.ErrorWithProps>;
    };
};
export default _default;
//# sourceMappingURL=resolver.d.ts.map