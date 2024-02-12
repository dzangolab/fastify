import type { ApiConfig } from "@dzangolab/fastify-config";

const getMultiTenantConfig = (config: ApiConfig) => {
  const migrationsPath = config.slonik?.migrations?.path || "migrations";

  return {
    migrations: {
      path: config.multiTenant?.migrations?.path || `${migrationsPath}/tenants`,
    },
    reserved: {
      admin: {
        domains: config.multiTenant.reserved?.admin?.domains || [],
        enabled: config.multiTenant.reserved?.admin?.enabled ?? true,
        slugs: config.multiTenant.reserved?.admin?.slugs || ["admin"],
      },
      blacklisted: {
        domains: config.multiTenant.reserved?.blacklisted?.domains || [],
        enabled: config.multiTenant.reserved?.blacklisted?.enabled ?? true,
        slugs: config.multiTenant.reserved?.blacklisted?.slugs || [],
      },
      others: {
        domains: config.multiTenant.reserved?.others?.domains || [],
        enabled: config.multiTenant.reserved?.others?.enabled ?? true,
        slugs: config.multiTenant.reserved?.others?.slugs || [],
      },
      www: {
        domains: config.multiTenant.reserved?.www?.domains || [],
        enabled: config.multiTenant.reserved?.www?.enabled ?? true,
        slugs: config.multiTenant.reserved?.www?.slugs || ["www"],
      },
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
