import { ApiConfig } from "@dzangolab/fastify-config";
import type { Database, Tenant, TenantInput } from "./types";
import type { SqlTaggedTemplate } from "slonik";
declare const tableName = "tenants";
declare const TenantService: (config: ApiConfig, database: Database, sql: SqlTaggedTemplate) => {
    all: () => Promise<readonly Tenant[]>;
    create: (data: TenantInput) => Promise<Tenant>;
    delete: (id: number) => Promise<Tenant | null>;
    findById: (id: number) => Promise<Tenant | null>;
    update: (id: number, data: TenantInput) => Promise<Tenant>;
};
export default TenantService;
export { tableName };
//# sourceMappingURL=tenantService.d.ts.map