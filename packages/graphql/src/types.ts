import type {
  FastifyPluginCallback,
  FastifyPluginAsync,
  FastifyRequest,
  FastifyReply,
} from "fastify";
import type { MercuriusContext, MercuriusOptions } from "mercurius";

export interface GraphqlConfig extends MercuriusOptions {
  enabled?: boolean;
  plugins?: GraphqlEnabledPlugin[];
}

export interface GraphqlEnabledPlugin
  extends FastifyPluginAsync,
    FastifyPluginCallback {
  updateContext: (
    context: MercuriusContext,
    request: FastifyRequest,
    reply: FastifyReply,
  ) => Promise<void>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GraphqlOptions extends GraphqlConfig {}
