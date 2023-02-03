import type { MultiTenantConfig, Tenant } from "./types";

declare module "@dzangolab/fastify-config" {
  interface ApiConfig {
    multiTenant: MultiTenantConfig;
  }
}

declare module "fastify" {
  interface FastifyRequest {
    tenant: Tenant;
  }
}

export { default } from "./plugin";

export { default as TenantService } from "./model/tenants/service";

export type {
  MultiTenantConfig,
  MultiTenantEnabledConfig,
  Tenant,
  TenantCreateInput,
  TenantUpdateInput,
} from "./types";
