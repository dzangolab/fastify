import type { ApiConfig } from "@dzangolab/fastify-config";
import type { Tenant } from "@dzangolab/fastify-multi-tenant";
declare const Email: {
    addTenantPrefix: (config: ApiConfig, email: string, tenant: Tenant | undefined) => string;
    removeTenantPrefix: (email: string, tenant: Tenant | undefined) => string;
};
export default Email;
//# sourceMappingURL=email.d.ts.map