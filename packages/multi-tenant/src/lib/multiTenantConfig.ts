import type { ApiConfig } from "@dzangolab/fastify-config";

const getMultiTenantConfig = (config: ApiConfig) => {
  return {
    migrations: {
      directory: config.multiTenant?.migrations?.directory || "tenants",
    },
    table: {
      name: config.multiTenant?.table?.name || "tenants",
      columns: {
        id: config.multiTenant?.table?.columns.id || "id",
        name: config.multiTenant?.table?.columns.name || "name",
        slug: config.multiTenant?.table?.columns.slug || "slug",
        domain: config.multiTenant?.table?.columns.domain || "domain",
      },
    },
  };
};

export default getMultiTenantConfig;
