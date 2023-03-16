import { BaseService } from "@dzangolab/fastify-slonik";
import UserSqlFactory from "./sqlFactory";
import type { Service } from "@dzangolab/fastify-slonik";
import type { QueryResultRow } from "slonik";
declare class UserProfileService<UserProfile extends QueryResultRow, UserProfileCreateInput extends QueryResultRow, UserProfileUpdateInput extends QueryResultRow> extends BaseService<UserProfile, UserProfileCreateInput, UserProfileUpdateInput> implements Service<UserProfile, UserProfileCreateInput, UserProfileUpdateInput> {
    static readonly LIMIT_DEFAULT = 20;
    static readonly LIMIT_MAX = 50;
    get table(): string;
    get factory(): UserSqlFactory<UserProfile, UserProfileCreateInput, UserProfileUpdateInput>;
}
export default UserProfileService;
//# sourceMappingURL=service.d.ts.map