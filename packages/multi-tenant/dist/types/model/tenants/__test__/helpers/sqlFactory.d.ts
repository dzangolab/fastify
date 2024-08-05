import TenantSqlFactory from "../../sqlFactory";
import type { QueryResultRow } from "slonik";
declare class TestSqlFactory<Tenant extends QueryResultRow, TenantCreateInput extends QueryResultRow, TenantUpdateInput extends QueryResultRow> extends TenantSqlFactory<Tenant, TenantCreateInput, TenantUpdateInput> {
    getFieldMappings: () => Map<string, string>;
    getMappedFieldPublic: (field: string) => string;
    getAliasedFieldPublic: (field: string) => import("slonik").IdentifierSqlToken | import("slonik").ListSqlToken;
}
export default TestSqlFactory;
//# sourceMappingURL=sqlFactory.d.ts.map