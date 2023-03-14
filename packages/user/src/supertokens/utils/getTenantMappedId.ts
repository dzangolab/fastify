import { ApiConfig } from "@dzangolab/fastify-config";

const getTenantMappedId = (config: ApiConfig) => {
  return config.multiTenant?.table?.columns?.id || "id";
};

export default getTenantMappedId;
