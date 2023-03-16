import { DefaultSqlFactory } from "@dzangolab/fastify-slonik";
import type { Service, SqlFactory } from "@dzangolab/fastify-slonik";
import type { QueryResultRow } from "slonik";
declare class TenantSqlFactory<Tenant extends QueryResultRow, TenantCreateInput extends QueryResultRow, TenantUpdateInput extends QueryResultRow> extends DefaultSqlFactory<Tenant, TenantCreateInput, TenantUpdateInput> implements SqlFactory<Tenant, TenantCreateInput, TenantUpdateInput> {
    protected fieldMappings: Map<string, string>;
    constructor(service: Service<Tenant, TenantCreateInput, TenantUpdateInput>);
    getAllWithAliasesSql: (fields: string[]) => import("slonik").TaggedTemplateLiteralInvocation<Tenant>;
    getCreateSql: (data: TenantCreateInput) => import("slonik").TaggedTemplateLiteralInvocation<Tenant>;
    getFindByHostnameSql: (hostname: string, rootDomain: string) => import("slonik").TaggedTemplateLiteralInvocation<Tenant>;
    protected getAliasedField: (field: string) => import("slonik").IdentifierSqlToken | import("slonik").ListSqlToken;
    protected getMappedField: (field: string) => string;
    protected init(): void;
}
export default TenantSqlFactory;
//# sourceMappingURL=sqlFactory.d.ts.map