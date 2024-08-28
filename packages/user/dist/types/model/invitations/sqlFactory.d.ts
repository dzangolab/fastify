import { DefaultSqlFactory } from "@dzangolab/fastify-slonik";
import type { SqlFactory, FilterInput, SortInput } from "@dzangolab/fastify-slonik";
import type { QueryResultRow, QuerySqlToken } from "slonik";
declare class InvitationSqlFactory<Invitation extends QueryResultRow, InvitationCreateInput extends QueryResultRow, InvitationUpdateInput extends QueryResultRow> extends DefaultSqlFactory<Invitation, InvitationCreateInput, InvitationUpdateInput> implements SqlFactory<Invitation, InvitationCreateInput, InvitationUpdateInput> {
    getFindByTokenSql: (token: string) => QuerySqlToken;
    getListSql: (limit: number, offset?: number, filters?: FilterInput, sort?: SortInput[]) => QuerySqlToken;
}
export default InvitationSqlFactory;
//# sourceMappingURL=sqlFactory.d.ts.map