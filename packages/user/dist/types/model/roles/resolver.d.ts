import type { MercuriusContext } from "mercurius";
declare const _default: {
    Mutation: {
        createRole: (parent: unknown, arguments_: {
            role: string;
            permissions: string[];
        }, context: MercuriusContext) => Promise<import("mercurius").ErrorWithProps | {
            status: "OK";
        }>;
        deleteRole: (parent: unknown, arguments_: {
            role: string;
        }, context: MercuriusContext) => Promise<import("mercurius").ErrorWithProps | {
            status: "OK";
        }>;
        updateRolePermissions: (parent: unknown, arguments_: {
            role: string;
            permissions: string[];
        }, context: MercuriusContext) => Promise<import("mercurius").ErrorWithProps | {
            status: "OK";
            permissions: string[];
        }>;
    };
    Query: {
        roles: (parent: unknown, arguments_: Record<string, never>, context: MercuriusContext) => Promise<import("mercurius").ErrorWithProps | {
            role: string;
            permissions: string[];
        }[]>;
        rolePermissions: (parent: unknown, arguments_: {
            role: string;
        }, context: MercuriusContext) => Promise<string[] | import("mercurius").ErrorWithProps>;
    };
};
export default _default;
//# sourceMappingURL=resolver.d.ts.map