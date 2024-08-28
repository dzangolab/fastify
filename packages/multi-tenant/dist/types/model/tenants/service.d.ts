import { BaseService } from "@dzangolab/fastify-slonik";
import SqlFactory from "./sqlFactory";
import type { Service } from "@dzangolab/fastify-slonik";
import type { QueryResultRow } from "slonik";
declare class TenantService<Tenant extends QueryResultRow, TenantCreateInput extends QueryResultRow, TenantUpdateInput extends QueryResultRow> extends BaseService<Tenant, TenantCreateInput, TenantUpdateInput> implements Service<Tenant, TenantCreateInput, TenantUpdateInput> {
    protected _ownerId: string | undefined;
    all: (fields: string[]) => Promise<readonly Tenant[]>;
    create: (data: TenantCreateInput) => Promise<Tenant | undefined>;
    findByHostname: (hostname: string) => Promise<Tenant | null>;
    validateSlugOrDomain: (slug: string, domain?: string) => Promise<void>;
    get factory(): SqlFactory<Tenant, TenantCreateInput, TenantUpdateInput>;
    get sortKey(): string;
    get ownerId(): string | undefined;
    set ownerId(ownerId: string | undefined);
    get table(): string;
    protected postCreate: (tenant: Tenant) => Promise<Tenant>;
}
export default TenantService;
//# sourceMappingURL=service.d.ts.map