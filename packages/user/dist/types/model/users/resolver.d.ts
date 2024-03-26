import mercurius from "mercurius";
import type { UserUpdateInput } from "./../../types";
import type { FilterInput, SortInput } from "@dzangolab/fastify-slonik";
import type { MercuriusContext } from "mercurius";
declare const _default_1: {
    Mutation: {
        adminSignUp: (parent: unknown, arguments_: {
            data: {
                email: string;
                password: string;
            };
        }, context: MercuriusContext) => Promise<{
            status: "OK";
            user: import("supertokens-node/recipe/thirdpartyemailpassword").User;
        } | mercurius.ErrorWithProps>;
        disableUser: (parent: unknown, arguments_: {
            id: string;
        }, context: MercuriusContext) => Promise<mercurius.ErrorWithProps | {
            status: string;
        }>;
        enableUser: (parent: unknown, arguments_: {
            id: string;
        }, context: MercuriusContext) => Promise<mercurius.ErrorWithProps | {
            status: string;
        }>;
        changePassword: (parent: unknown, arguments_: {
            oldPassword: string;
            newPassword: string;
        }, context: MercuriusContext) => Promise<{
            status: string;
            message: string | undefined;
        } | {
            status: string;
            message?: undefined;
        } | mercurius.ErrorWithProps>;
        updateMe: (parent: unknown, arguments_: {
            data: UserUpdateInput;
        }, context: MercuriusContext) => Promise<(import("./../../types").User & import("slonik").QueryResultRow) | mercurius.ErrorWithProps | {
            status: string;
            message: string;
        }>;
    };
    Query: {
        canAdminSignUp: (parent: unknown, arguments_: {
            id: string;
        }, context: MercuriusContext) => Promise<mercurius.ErrorWithProps | {
            signUp: boolean;
        }>;
        me: (parent: unknown, arguments_: Record<string, never>, context: MercuriusContext) => Promise<(import("./../../types").User & import("slonik").QueryResultRow) | mercurius.ErrorWithProps | null>;
        user: (parent: unknown, arguments_: {
            id: string;
        }, context: MercuriusContext) => Promise<(import("./../../types").User & import("slonik").QueryResultRow) | null>;
        users: (parent: unknown, arguments_: {
            limit: number;
            offset: number;
            filters?: FilterInput | undefined;
            sort?: SortInput[] | undefined;
        }, context: MercuriusContext) => Promise<import("@dzangolab/fastify-slonik/dist/types/types/service").PaginatedList<import("./../../types").User & import("slonik").QueryResultRow>>;
    };
};
export default _default_1;
//# sourceMappingURL=resolver.d.ts.map