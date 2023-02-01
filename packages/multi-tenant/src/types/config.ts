import type { SlonikEnabledConfig } from "@dzangolab/fastify-slonik";

interface MultiTenantConfig {
  migrations?: {
    path?: string;
  };
  reserved?: {
    slugs: string[];
  };
  rootDomain?: string;
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

type MultiTenantEnabledConfig = SlonikEnabledConfig & {
  multiTenant?: MultiTenantConfig;
};

export type { MultiTenantConfig, MultiTenantEnabledConfig };
