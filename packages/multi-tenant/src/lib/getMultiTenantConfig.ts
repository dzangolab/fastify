import type { ApiConfig } from "@dzangolab/fastify-config";

const getMultiTenantConfig = (config: ApiConfig) => {
  const migrationsPath = config.slonik?.migrations?.path || "migrations";

  return {
    migrations: {
      path: config.multiTenant?.migrations?.path || `${migrationsPath}/tenants`,
    },
    reserved: {
      domains: config.multiTenant?.reserved?.domains || [],
      slugs: config.multiTenant?.reserved?.slugs || [],
    },
    table: {
      name: config.multiTenant?.table?.name || "tenants",
      columns: {
        id: config.multiTenant?.table?.columns?.id || "id",
        domain: config.multiTenant?.table?.columns?.domain || "domain",
        name: config.multiTenant?.table?.columns?.name || "name",
        ownerId: config.multiTenant?.table?.columns?.ownerId || "owner_id",
        slug: config.multiTenant?.table?.columns?.slug || "slug",
      },
    },
  };
};

export default getMultiTenantConfig;
