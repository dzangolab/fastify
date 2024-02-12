import getMultiTenantConfig from "./getMultiTenantConfig";

import type { ApiConfig } from "@dzangolab/fastify-config";

const getAllReservedDomains = (config: ApiConfig) => {
  const reserved = getMultiTenantConfig(config).reserved;

  let allReservedDomain: string[] = [];

  for (const [, app] of Object.entries(reserved)) {
    if (app.enabled) {
      allReservedDomain = [...allReservedDomain, ...app.domains];
    }
  }

  return allReservedDomain;
};

export default getAllReservedDomains;
