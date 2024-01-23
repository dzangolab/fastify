interface ColumnMappings {
  domain?: string;
  id?: string;
  name?: string;
  ownerId?: string;
  slug?: string;
}

interface MultiTenantConfig {
  migrations?: {
    path?: string;
  };
  reserved?: {
    admin?: {
      domains?: string[];
      enabled?: boolean;
      slugs?: string[];
    };
    blacklist?: {
      domains?: string[];
      enabled?: boolean;
      slugs?: string[];
    };
    others?: {
      domains?: string[];
      enabled?: boolean;
      slugs?: string[];
    };
    www?: {
      domains?: string[];
      enabled?: boolean;
      slugs?: string[];
    };
  };
  rootDomain: string;
  table?: {
    columns?: ColumnMappings;
    name?: string;
  };
}

export type { ColumnMappings, MultiTenantConfig };
