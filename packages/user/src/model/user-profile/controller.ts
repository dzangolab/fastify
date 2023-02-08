import Service from "./service";

import type { FastifyInstance, FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const plugin = async (
  fastify: FastifyInstance,
  options: unknown,
  done: () => void
) => {
  fastify.get(
    "/users",
    {
      preHandler: fastify.verifySession(),
    },
    async (request: SessionRequest, reply: FastifyReply) => {
      const service = new Service(request.config, request.slonik);

      const { limit, offset } = request.query as {
        limit: number;
        offset?: number;
      };

      const data = await service.list(limit, offset);

      reply.send(data);
    }
  );

  done();
};

export default plugin;
