import type { FastifyReply, FastifyRequest } from "fastify";
import type { MercuriusContext } from "mercurius";

const tenantContext = async (
  context: MercuriusContext,
  request: FastifyRequest,
  // eslint-disable-next-line  @typescript-eslint/no-unused-vars
  reply: FastifyReply
) => {
  context.tenant = request.tenant;
};

export default tenantContext;
