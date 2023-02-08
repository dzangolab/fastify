import type { MercuriusEnabledPlugin } from "./types";
import type { ApiConfig } from "@dzangolab/fastify-config";
import type { Database } from "@dzangolab/fastify-slonik";
import type { MercuriusOptions } from "mercurius";

declare module "mercurius" {
  interface MercuriusContext {
    config: ApiConfig;
    database: Database;
  }
}

declare module "@dzangolab/fastify-config" {
  interface ApiConfig {
    mercurius: MercuriusOptions & {
      enabled?: boolean;
      plugins?: MercuriusEnabledPlugin[];
    };
  }
}

export { default } from "./plugin";

export { type MercuriusEnabledPlugin } from "./types";
