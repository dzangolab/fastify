interface ColumnMappings {
  domain?: string;
  id?: string;
  name?: string;
  slug?: string;
}

interface MultiTenantConfig {
  migrations?: {
    path?: string;
  };
  reserved?: {
    domains?: string[];
    slugs?: string[];
  };
  rootDomain: string;
  table?: {
    columns?: ColumnMappings;
    name?: string;
  };
}

export type { ColumnMappings, MultiTenantConfig };
