import type { TenantInput } from "./types";
import type { Client } from "pg";
declare const runTenantMigrations: (client: Client, path: string, tenant: TenantInput) => Promise<void>;
export default runTenantMigrations;
//# sourceMappingURL=runTenantMigrations.d.ts.map