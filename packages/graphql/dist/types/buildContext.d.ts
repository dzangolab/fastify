import type { FastifyRequest, FastifyReply } from "fastify";
import type { MercuriusContext } from "mercurius";
declare const buildContext: (request: FastifyRequest, reply: FastifyReply) => Promise<MercuriusContext>;
export default buildContext;
//# sourceMappingURL=buildContext.d.ts.map