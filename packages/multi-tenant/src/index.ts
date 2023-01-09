import type { MultiTenantConfig } from "./types";
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import type { ApiConfig } from "@dzangolab/fastify-config";

declare module "@dzangolab/fastify-config" {
  interface ApiConfig {
    multiTenant: MultiTenantConfig;
  }
}

export { default } from "./plugin";

export type { MultiTenantConfig } from "./types";
