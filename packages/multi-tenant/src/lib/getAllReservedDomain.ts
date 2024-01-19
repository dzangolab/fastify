import getMultiTenantConfig from "./getMultiTenantConfig";

import type { ApiConfig } from "@dzangolab/fastify-config";

const getAllReservedDomain = (config: ApiConfig) => {
  const reserved = getMultiTenantConfig(config).reserved;

  let allReservedDomain: string[] = [];

  for (const [, key] of Object.entries(reserved)) {
    if (key.enabled) {
      allReservedDomain = [...allReservedDomain, ...key.domains];
    }
  }

  return allReservedDomain;
};

export default getAllReservedDomain;
