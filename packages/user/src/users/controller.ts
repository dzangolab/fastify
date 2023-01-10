import { verifySession } from "supertokens-node/recipe/session/framework/fastify";

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
      preHandler: verifySession(),
    },
    async (request: SessionRequest, reply: FastifyReply) => {
      const service = Service(request.config, request.slonik, request.sql);

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
