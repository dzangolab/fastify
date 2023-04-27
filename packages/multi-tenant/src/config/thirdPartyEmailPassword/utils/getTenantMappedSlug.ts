import { ApiConfig } from "@dzangolab/fastify-config";

const getTenantMappedSlug = (config: ApiConfig) => {
  return config.multiTenant?.table?.columns?.slug || "slug";
};

export default getTenantMappedSlug;
