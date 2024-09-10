import type {
  FastifyPluginCallback,
  FastifyPluginAsync,
  FastifyRequest,
  FastifyReply,
} from "fastify";
import type { MercuriusContext } from "mercurius";

export interface GraphqlEnabledPlugin
  extends FastifyPluginAsync,
    FastifyPluginCallback {
  updateContext: (
    context: MercuriusContext,
    request: FastifyRequest,
    reply: FastifyReply
  ) => Promise<void>;
}
