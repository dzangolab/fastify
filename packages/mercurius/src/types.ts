import { FastifyRequest } from "fastify";
import { MercuriusContext } from "mercurius";

import type { FastifyPluginCallback, FastifyPluginAsync } from "fastify";

export interface MercuriusEnabledPlugin
  extends FastifyPluginAsync,
    FastifyPluginCallback {
  updateContext: (
    context: MercuriusContext,
    request: FastifyRequest
  ) => Promise<MercuriusContext>;
}
