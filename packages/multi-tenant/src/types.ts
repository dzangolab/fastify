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

export type { MultiTenantConfig };
