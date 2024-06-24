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

export * as validateTenantSchema from "./lib/validateTenantSchema";

export { default as tenantMigrationPlugin } from "./migratePlugin";

export { default as thirdPartyEmailPassword } from "./supertokens/recipes";

export { default as invitationResolver } from "./invitations/resolver";

export { default as tenantResolver } from "./model/tenants/resolver";

export { default as tenantRoutes } from "./model/tenants/controller";

export type {
  MultiTenantConfig,
  Tenant,
  TenantCreateInput,
  TenantUpdateInput,
} from "./types";
