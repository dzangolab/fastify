import { MultiTenantConfig } from "../types";

const getAllReservedSlug = (multiTenant: MultiTenantConfig) => {
  const slugs = multiTenant.reserved.slugs;

  let allSlugs: string[] = [];

  for (const value of Object.entries(slugs)) {
    const values = (Array.isArray(value) ? value : [value]) as string[];

    allSlugs = [...allSlugs, ...values];
  }

  return allSlugs;
};

export default getAllReservedSlug;
