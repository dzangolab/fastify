import type { ApiConfig } from "@dzangolab/fastify-config";

const getMultiTenantConfig = (config: ApiConfig) => {
  const migrationsPath = config.slonik?.migrations?.path || "migrations";

  return {
    migrations: {
      path: config.multiTenant.migrations?.path || `${migrationsPath}/tenants`,
    },
    reserved: {
      domains: config.multiTenant.reserved?.domains || [],
      slugs: config.multiTenant.reserved?.slugs || [],
    },
    rootDomain: config.multiTenant.rootDomain,
    table: {
      name: config.multiTenant.table?.name || "tenants",
      columns: {
        id: config.multiTenant.table?.columns?.id || "id",
        name: config.multiTenant.table?.columns?.name || "name",
        slug: config.multiTenant.table?.columns?.slug || "slug",
        domain: config.multiTenant.table?.columns?.domain || "domain",
      },
    },
  };
};

export default getMultiTenantConfig;
