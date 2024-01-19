import getMultiTenantConfig from "./getMultiTenantConfig";

import type { ApiConfig } from "@dzangolab/fastify-config";

const getAllReservedSlug = (config: ApiConfig) => {
  const reserved = getMultiTenantConfig(config).reserved;

  let allReservedSlugs: string[] = [];

  for (const [, key] of Object.entries(reserved)) {
    if (key.enabled) {
      allReservedSlugs = [...allReservedSlugs, ...key.slugs];
    }
  }

  return allReservedSlugs;
};

export default getAllReservedSlug;
