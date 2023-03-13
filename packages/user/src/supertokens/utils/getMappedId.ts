import { ApiConfig } from "@dzangolab/fastify-config";

const getMappedId = (config: ApiConfig) => {
  return config.multiTenant?.table?.columns?.id || "id";
};

export default getMappedId;
