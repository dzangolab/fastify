interface MultiTenantConfig {
  table: {
    columns: {
      domain?: string;
      id?: string;
      name?: string;
      slug?: string;
    };
  };
}

type Tenant = {
  id: number;
  name: string;
  slug: string;
};

type TenantInput = Omit<Tenant, "id">;

export type { MultiTenantConfig, Tenant, TenantInput };
