import { DefaultSqlFactory } from "@dzangolab/fastify-slonik";
import type { Service } from "../../types/tenantService";
import type { FilterInput, SortInput } from "@dzangolab/fastify-slonik";
import type { QueryResultRow, QuerySqlToken } from "slonik";
declare class TenantSqlFactory<Tenant extends QueryResultRow, TenantCreateInput extends QueryResultRow, TenantUpdateInput extends QueryResultRow> extends DefaultSqlFactory<Tenant, TenantCreateInput, TenantUpdateInput> {
    protected fieldMappings: Map<string, string>;
    constructor(service: Service<Tenant, TenantCreateInput, TenantUpdateInput>);
    getAllWithAliasesSql: (fields: string[]) => QuerySqlToken;
    getCountSql: (filters?: FilterInput) => QuerySqlToken;
    getCreateSql: (data: TenantCreateInput) => QuerySqlToken;
    getFindByHostnameSql: (hostname: string, rootDomain: string) => QuerySqlToken;
    getFindByIdSql: (id: number | string) => QuerySqlToken;
    getFindBySlugOrDomainSql: (slug: string, domain?: string) => QuerySqlToken;
    getListSql: (limit: number, offset?: number, filters?: FilterInput, sort?: SortInput[]) => QuerySqlToken;
    protected getAliasedField: (field: string) => import("slonik").IdentifierSqlToken | import("slonik").ListSqlToken;
    protected getMappedField: (field: string) => string;
    protected init(): void;
    protected filterWithOwnerId(filters?: FilterInput): FilterInput | undefined;
    get ownerId(): string | undefined;
}
export default TenantSqlFactory;
//# sourceMappingURL=sqlFactory.d.ts.map