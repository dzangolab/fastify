import Service from "./service";

import type { ChangePasswordInput, UserUpdateInput } from "../../types";
import type { FastifyInstance, FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const plugin = async (
  fastify: FastifyInstance,
  options: unknown,
  done: () => void
) => {
  const ROUTE_CHANGE_PASSWORD = "/change_password";
  const ROUTE_ME = "/me";
  const ROUTE_USERS = "/users";

  fastify.get(
    ROUTE_USERS,
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

  fastify.post(
    ROUTE_CHANGE_PASSWORD,
    {
      preHandler: fastify.verifySession(),
    },
    async (request: SessionRequest, reply: FastifyReply) => {
      try {
        const session = request.session;
        const requestBody = request.body as ChangePasswordInput;
        const userId = session && session.getUserId();
        if (!userId) {
          throw new Error("User not found in session");
        }
        const oldPassword = requestBody.oldPassword ?? "";
        const newPassword = requestBody.newPassword ?? "";

        const service = new Service(request.config, request.slonik);
        const data = await service.changePassword(
          userId,
          oldPassword,
          newPassword
        );

        reply.send(data);
      } catch (error) {
        fastify.log.error(error);
        reply.status(500);

        reply.send({
          status: "ERROR",
          message: "Oops! Something went wrong",
          error,
        });
      }
    }
  );

  fastify.get(
    ROUTE_ME,
    {
      preHandler: fastify.verifySession(),
    },
    async (request: SessionRequest, reply: FastifyReply) => {
      const service = new Service(request.config, request.slonik);
      const userId = request.session?.getUserId();

      if (userId) {
        reply.send(await service.findById(userId));
      } else {
        fastify.log.error("Could not able to get user id from session");

        throw new Error("Oops, Something went wrong");
      }
    }
  );

  fastify.put(
    ROUTE_ME,
    {
      preHandler: fastify.verifySession(),
    },
    async (request: SessionRequest, reply: FastifyReply) => {
      const userId = request.session?.getUserId();

      const input = request.body as UserUpdateInput;

      if (userId) {
        const service = new Service(request.config, request.slonik);

        if (
          "id" in input ||
          "email" in input ||
          "lastLoginAt" in input ||
          "signedUpAt" in input
        ) {
          throw new Error("Invalid user input");
        }

        reply.send(await service.update(userId, input));
      } else {
        fastify.log.error("Cound not get user id from session");

        throw new Error("Oops, Something went wrong");
      }
    }
  );

  done();
};

export default plugin;
