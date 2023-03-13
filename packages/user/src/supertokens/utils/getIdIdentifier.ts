import { ApiConfig } from "@dzangolab/fastify-config";

const getIdIdentifier = (config: ApiConfig) => {
  return config.multiTenant?.table?.columns?.id || "id";
};

export default getIdIdentifier;
