import Service from "./service";
import CustomApiError from "../../customApiError";

import type { RoleUpdateInput } from "../../types";
import type { FastifyInstance, FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const plugin = async (
  fastify: FastifyInstance,
  options: unknown,
  done: () => void
) => {
  fastify.get(
    "/roles",
    {
      preHandler: fastify.verifySession(),
    },
    async (request: SessionRequest, reply: FastifyReply) => {
      const service = new Service(request.config, request.slonik);

      const { limit, offset, filters, sort } = request.query as {
        limit: number;
        offset?: number;
        filters?: string;
        sort?: string;
      };

      const data = await service.list(
        limit,
        offset,
        filters ? JSON.parse(filters) : undefined,
        sort ? JSON.parse(sort) : undefined
      );

      reply.send(data);
    }
  );

  fastify.get(
    "/roles/:id(^\\d+)",
    {
      preHandler: fastify.verifySession(),
    },
    async (request: SessionRequest, reply) => {
      const service = new Service(request.config, request.slonik);

      const { id } = request.params as { id: number };

      const data = await service.findById(id);

      reply.send(data);
    }
  );

  fastify.delete(
    "/roles/:id(^\\d+)",
    {
      preHandler: fastify.verifySession(),
    },
    async (request: SessionRequest, reply: FastifyReply) => {
      const service = new Service(request.config, request.slonik);

      const { id } = request.params as { id: number };

      try {
        const data = await service.delete(id);

        reply.send(data);
      } catch (error) {
        if (error instanceof CustomApiError) {
          reply.status(error.statusCode);

          return reply.send({
            message: error.message,
            name: error.name,
            statusCode: error.statusCode,
          });
        }

        request.log.error(error);
        reply.status(500);

        return reply.send({
          status: "ERROR",
          message: "Oops! Something went wrong",
        });
      }
    }
  );

  fastify.post(
    "/roles",
    {
      preHandler: fastify.verifySession(),
    },
    async (request: SessionRequest, reply: FastifyReply) => {
      const service = new Service(request.config, request.slonik);
      const input = request.body as RoleUpdateInput;

      try {
        const data = await service.create(input);

        return reply.send(data);
      } catch (error) {
        if (error instanceof CustomApiError) {
          reply.status(error.statusCode);

          return reply.send({
            message: error.message,
            name: error.name,
            statusCode: error.statusCode,
          });
        }

        request.log.error(error);
        reply.status(500);

        return reply.send({
          status: "ERROR",
          message: "Oops! Something went wrong",
        });
      }
    }
  );

  fastify.put(
    "/roles/:id(^\\d+)",
    {
      preHandler: fastify.verifySession(),
    },
    async (request: SessionRequest, reply: FastifyReply) => {
      const service = new Service(request.config, request.slonik);

      const { id } = request.params as { id: number };

      const input = request.body as RoleUpdateInput;

      try {
        const data = await service.update(id, input);

        return reply.send(data);
      } catch (error) {
        if (error instanceof CustomApiError) {
          reply.status(error.statusCode);

          return reply.send({
            message: error.message,
            name: error.name,
            statusCode: error.statusCode,
          });
        }

        request.log.error(error);
        reply.status(500);

        return reply.send({
          status: "ERROR",
          message: "Oops! Something went wrong",
        });
      }
    }
  );

  done();
};

export default plugin;
