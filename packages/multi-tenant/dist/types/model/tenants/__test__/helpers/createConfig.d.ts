import type { MultiTenantConfig } from "../../../../types";
import type { ApiConfig } from "@dzangolab/fastify-config";
declare module "@dzangolab/fastify-config" {
    interface ApiConfig {
        multiTenant: MultiTenantConfig;
    }
}
declare const createConfig: (multiTenantConfig: Partial<MultiTenantConfig>) => ApiConfig;
export default createConfig;
//# sourceMappingURL=createConfig.d.ts.map