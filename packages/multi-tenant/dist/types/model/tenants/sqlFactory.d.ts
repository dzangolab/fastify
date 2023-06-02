import { DefaultSqlFactory } from "@dzangolab/fastify-slonik";
import type { Service } from "@dzangolab/fastify-slonik";
import type { QueryResultRow, QuerySqlToken } from "slonik";
declare class TenantSqlFactory<Tenant extends QueryResultRow, TenantCreateInput extends QueryResultRow, TenantUpdateInput extends QueryResultRow> extends DefaultSqlFactory<Tenant, TenantCreateInput, TenantUpdateInput> {
    protected fieldMappings: Map<string, string>;
    constructor(service: Service<Tenant, TenantCreateInput, TenantUpdateInput>);
    getAllWithAliasesSql: (fields: string[]) => QuerySqlToken;
    getCreateSql: (data: TenantCreateInput) => QuerySqlToken;
    getFindByHostnameSql: (hostname: string, rootDomain: string) => QuerySqlToken;
    protected getAliasedField: (field: string) => import("slonik").IdentifierSqlToken | import("slonik").ListSqlToken;
    protected getMappedField: (field: string) => string;
    protected init(): void;
}
export default TenantSqlFactory;
//# sourceMappingURL=sqlFactory.d.ts.map