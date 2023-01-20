import type { MultiTenantConfig, Tenant } from "./types";
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import type { ApiConfig } from "@dzangolab/fastify-config";

declare module "@dzangolab/fastify-config" {
  interface ApiConfig {
    multiTenant?: MultiTenantConfig;
  }
}

declare module "fastify" {
  interface FastifyRequest {
    tenant: Tenant;
  }
}

export { default } from "./plugin";

export type { MultiTenantConfig } from "./types";

export { default as TenantService } from "./model/tenants/service";
