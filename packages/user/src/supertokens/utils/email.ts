import getMappedId from "./getMappedId";

import type { Tenant } from "../../types";
import type { ApiConfig } from "@dzangolab/fastify-config";

const email = {
  appendTenantId: (
    config: ApiConfig,
    email: string,
    tenant: Tenant | undefined
  ) => {
    if (tenant) {
      email = tenant[getMappedId(config)] + "_" + email;
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
