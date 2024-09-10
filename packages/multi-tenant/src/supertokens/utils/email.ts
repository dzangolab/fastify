import getMultiTenantConfig from "../../lib/getMultiTenantConfig";

import type { Tenant } from "../../types";
import type { ApiConfig } from "@dzangolab/fastify-config";

const Email = {
  addTenantPrefix: (
    config: ApiConfig,
    email: string,
    tenant: Tenant | undefined,
  ) => {
    if (tenant) {
      email =
        tenant[getMultiTenantConfig(config).table.columns.id] + "_" + email;
    }

    return email;
  },
  removeTenantPrefix: (
    config: ApiConfig,
    email: string,
    tenant: Tenant | undefined,
  ) => {
    if (tenant) {
      const tenantId = tenant[getMultiTenantConfig(config).table.columns.id];

      if (
        tenantId == email.slice(0, Math.max(0, Math.max(0, email.indexOf("_"))))
      ) {
        email = email.slice(Math.max(0, email.indexOf("_") + 1));
      }
    }

    return email;
  },
};

export default Email;
