interface MultiTenantConfig {
  migrations?: {
    path?: string;
  };
  reserved?: {
    domains?: string[];
    slugs?: string[];
  };
  table?: {
    columns?: {
      domain?: string;
      id?: string;
      name?: string;
      slug?: string;
    };
    name?: string;
  };
}

type Tenant = Record<string, string>;
type TenantInput = Record<string, string>;

export type { MultiTenantConfig, Tenant, TenantInput };
