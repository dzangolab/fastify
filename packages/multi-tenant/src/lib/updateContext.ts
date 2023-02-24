import type { FastifyRequest } from "fastify";
import type { MercuriusContext } from "mercurius";

const updateContext = async (
  context: MercuriusContext,
  request: FastifyRequest
) => {
  if (request.config.mercurius.enabled) {
    context.tenant = request.tenant;
  }
};

export default updateContext;
