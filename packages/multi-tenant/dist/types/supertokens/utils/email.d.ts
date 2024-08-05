import type { Tenant } from "../../types";
import type { ApiConfig } from "@dzangolab/fastify-config";
declare const Email: {
    addTenantPrefix: (config: ApiConfig, email: string, tenant: Tenant | undefined) => string;
    removeTenantPrefix: (config: ApiConfig, email: string, tenant: Tenant | undefined) => string;
};
export default Email;
//# sourceMappingURL=email.d.ts.map