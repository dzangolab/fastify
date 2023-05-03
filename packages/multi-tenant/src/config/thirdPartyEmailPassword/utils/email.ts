import getMultiTenantConfig from "./../../../lib/getMultiTenantConfig";

import type { Tenant } from "../../../types";
import type { ApiConfig } from "@dzangolab/fastify-config";

const Email = {
  addTenantPrefix: (
    config: ApiConfig,
    email: string,
    tenant: Tenant | undefined
  ) => {
    if (tenant) {
      email =
        tenant[getMultiTenantConfig(config).table.columns.id] + "_" + email;
    }

    return email;
  },
  removeTenantPrefix: (email: string, tenant: Tenant | undefined) => {
    if (tenant) {
      email = email.slice(Math.max(0, email.indexOf("_") + 1));
    }

    return email;
  },
};

export default Email;
