import type { FastifyRequest } from "fastify";
import type { MercuriusContext } from "mercurius";

const tenantContext = async (
  context: MercuriusContext,
  request: FastifyRequest
) => {
  context.tenant = request.tenant;
};

export default tenantContext;
