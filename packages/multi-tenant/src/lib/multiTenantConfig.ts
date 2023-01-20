import type { ApiConfig } from "@dzangolab/fastify-config";

const getMultiTenantConfig = (config: ApiConfig) => {
  const migrationPath = config.slonik.migrations.path;

  return {
    migrations: {
      path: config.multiTenant?.migrations?.path || `${migrationPath}/tenants`,
    },
    reserved: {
      domains: config.multiTenant?.reserved?.domains || [],
      slugs: config.multiTenant?.reserved?.slugs || [],
    },
    table: {
      name: config.multiTenant?.table?.name || "tenants",
      columns: {
        id: config.multiTenant?.table?.columns?.id || "id",
        name: config.multiTenant?.table?.columns?.name || "name",
        slug: config.multiTenant?.table?.columns?.slug || "slug",
        domain: config.multiTenant?.table?.columns?.domain || "domain",
      },
    },
  };
};

export default getMultiTenantConfig;
