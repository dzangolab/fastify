import getIdIdentifier from "./getIdIdentifier";

import type { ApiConfig } from "@dzangolab/fastify-config";
import type { Tenant } from "@dzangolab/fastify-multi-tenant";

const email = {
  appendTenantId: (
    config: ApiConfig,
    email: string,
    tenant: Tenant | undefined
  ) => {
    if (tenant) {
      email = tenant[getIdIdentifier(config)] + "_" + email;
    }

    return email;
  },
  removeTenantId: (email: string, tenant: Tenant | undefined) => {
    if (tenant) {
      email = email.slice(Math.max(0, email.indexOf("_") + 1));
    }

    return email;
  },
};

export default email;
