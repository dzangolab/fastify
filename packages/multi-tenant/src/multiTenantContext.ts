import type { FastifyReply, FastifyRequest } from "fastify";
import type { MercuriusContext } from "mercurius";

const multiTenantContext = async (
  context: MercuriusContext,
  request: FastifyRequest,
  reply: FastifyReply
) => {

  if (request.tenant){
    context.tenant = request.tenant;
  }
}

export default multiTenantContext;
