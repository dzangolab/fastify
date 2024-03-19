import type { PaginatedList } from "@dzangolab/fastify-slonik";
import type { MercuriusContext } from "mercurius";
import type { QueryResultRow } from "slonik";
import type { User as SupertokensUser } from "supertokens-node/recipe/thirdpartyemailpassword";
interface ChangePasswordInput {
    oldPassword?: string;
    newPassword?: string;
}
interface EmailErrorMessages {
    invalid?: string;
    required?: string;
}
interface PasswordErrorMessages {
    required?: string;
    weak?: string;
}
interface Resolver {
    [key: string]: (parent: unknown, argyments_: {
        [key: string]: unknown;
    }, context: MercuriusContext) => Promise<QueryResultRow | null | PaginatedList<QueryResultRow>>;
}
interface User {
    id: string;
    disabled: boolean;
    email: string;
    lastLoginAt: number;
    roles?: string[];
    signedUpAt: number;
}
type UserCreateInput = Partial<Omit<User, "disabled" | "lastLoginAt" | "roles" | "signedUpAt">> & {
    lastLoginAt?: string;
    signedUpAt?: string;
};
type UserUpdateInput = Partial<Omit<User, "id" | "lastLoginAt" | "roles" | "signedUpAt">> & {
    lastLoginAt?: string;
};
interface AuthUser extends User, SupertokensUser {
}
export type { AuthUser, ChangePasswordInput, EmailErrorMessages, PasswordErrorMessages, Resolver, User, UserCreateInput, UserUpdateInput, };
export type { IsEmailOptions } from "./isEmailOptions";
export type { StrongPasswordOptions } from "./strongPasswordOptions";
//# sourceMappingURL=index.d.ts.map