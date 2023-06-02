import { BaseService } from "@dzangolab/fastify-slonik";
import UserSqlFactory from "./sqlFactory";
import type { Service } from "@dzangolab/fastify-slonik";
import type { QueryResultRow } from "slonik";
declare class UserService<User extends QueryResultRow, UserCreateInput extends QueryResultRow, UserUpdateInput extends QueryResultRow> extends BaseService<User, UserCreateInput, UserUpdateInput> implements Service<User, UserCreateInput, UserUpdateInput> {
    get table(): string;
    get factory(): UserSqlFactory<User, UserCreateInput, UserUpdateInput>;
    changePassword: (userId: string, oldPassword: string, newPassword: string) => Promise<{
        status: string;
        message: string | undefined;
    } | {
        status: string;
        message?: undefined;
    }>;
}
export default UserService;
//# sourceMappingURL=service.d.ts.map