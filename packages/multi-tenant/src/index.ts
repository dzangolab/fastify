import "@dzangolab/fastify-config";
import "mercurius";

import type { MultiTenantConfig, Tenant } from "./types";

declare module "@dzangolab/fastify-config" {
  interface ApiConfig {
    multiTenant: MultiTenantConfig;
  }
}

declare module "fastify" {
  interface FastifyRequest {
    tenant?: Tenant;
  }
}

declare module "mercurius" {
  interface MercuriusContext {
    tenant?: Tenant;
  }
}

export { default } from "./plugin";

export { default as TenantService } from "./model/tenants/service";

export { default as thirdPartyEmailPassword } from "./config";

export type {
  MultiTenantConfig,
  Tenant,
  TenantCreateInput,
  TenantUpdateInput,
} from "./types";
