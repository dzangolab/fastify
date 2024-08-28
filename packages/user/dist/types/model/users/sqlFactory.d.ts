import { DefaultSqlFactory } from "@dzangolab/fastify-slonik";
import { QueryResultRow, QuerySqlToken } from "slonik";
import type { SqlFactory, FilterInput, SortInput } from "@dzangolab/fastify-slonik";
declare class UserSqlFactory<User extends QueryResultRow, UserCreateInput extends QueryResultRow, UserUpdateInput extends QueryResultRow> extends DefaultSqlFactory<User, UserCreateInput, UserUpdateInput> implements SqlFactory<User, UserCreateInput, UserUpdateInput> {
    getFindByIdSql: (id: number | string) => QuerySqlToken;
    getListSql: (limit: number, offset?: number, filters?: FilterInput, sort?: SortInput[]) => QuerySqlToken;
    getUpdateSql: (id: number | string, data: UserUpdateInput) => QuerySqlToken;
}
export default UserSqlFactory;
//# sourceMappingURL=sqlFactory.d.ts.map