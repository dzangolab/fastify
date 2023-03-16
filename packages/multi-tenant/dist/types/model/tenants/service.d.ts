import { BaseService } from "@dzangolab/fastify-slonik";
import SqlFactory from "./sqlFactory";
import type { Service } from "@dzangolab/fastify-slonik";
import type { QueryResultRow } from "slonik";
declare class TenantService<Tenant extends QueryResultRow, TenantCreateInput extends QueryResultRow, TenantUpdateInput extends QueryResultRow> extends BaseService<Tenant, TenantCreateInput, TenantUpdateInput> implements Service<Tenant, TenantCreateInput, TenantUpdateInput> {
    all: (fields: string[]) => Promise<readonly Tenant[]>;
    findByHostname: (hostname: string) => Promise<Tenant | null>;
    get factory(): SqlFactory<Tenant, TenantCreateInput, TenantUpdateInput>;
    get table(): string;
    protected postCreate: (tenant: Tenant) => Promise<Tenant>;
}
export default TenantService;
//# sourceMappingURL=service.d.ts.map