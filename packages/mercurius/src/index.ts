import { FastifyRequest } from "fastify";

import type { ApiConfig } from "@dzangolab/fastify-config";
import type { Database } from "@dzangolab/fastify-slonik";
import type { FastifyPluginCallback, FastifyPluginAsync } from "fastify";
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
      plugins?: MercuriusEnabledPlugin[];
    };
  }
}

export interface MercuriusEnabledPlugin {
  plugin: FastifyPluginAsync | FastifyPluginCallback;
  updateContext: (
    context: MercuriusContext,
    request: FastifyRequest
  ) => Promise<MercuriusContext>;
}

export { default } from "./plugin";
