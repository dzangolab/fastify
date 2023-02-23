import type { FastifyRequest } from "fastify";
import type { MercuriusContext } from "mercurius";

const addTenantContext = async (
  context: MercuriusContext,
  request: FastifyRequest
) => {
  if (request.config.mercurius.enabled) {
    context.tenant = request.tenant;
  }
};

export default addTenantContext;
