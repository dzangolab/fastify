import type { ApiConfig } from "@dzangolab/fastify-config";
import type { Database } from "@dzangolab/fastify-slonik";
import type { MercuriusContext, MercuriusOptions } from "mercurius";
import type { SqlTaggedTemplate } from "slonik";

declare module "mercurius" {
  interface MercuriusContext {
    config: ApiConfig;
    database: Database;
    sql: SqlTaggedTemplate;
  }
}

declare module "@dzangolab/fastify-config" {
  interface ApiConfig {
    mercurius: MercuriusOptions & {
      enabled?: boolean;
      plugins?: ((context: MercuriusContext) => Promise<MercuriusContext>)[];
    };
  }
}

export { default } from "./plugin";
