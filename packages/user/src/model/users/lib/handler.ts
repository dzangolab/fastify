import { ChangePasswordInput } from "../../../types";
import Service from "../service";

import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const handlers = {
  changePassword: async (request: SessionRequest, reply: FastifyReply) => {
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
      request.log.error(error);
      reply.status(500);

      reply.send({
        status: "ERROR",
        message: "Oops! Something went wrong",
        error,
      });
    }
  },
  me: async (request: SessionRequest, reply: FastifyReply) => {
    const service = new Service(request.config, request.slonik);
    const userId = request.session?.getUserId();

    if (userId) {
      reply.send(await service.findById(userId));
    } else {
      request.log.error("Could not able to get user id from session");

      throw new Error("Oops, Something went wrong");
    }
  },
  users: async (request: SessionRequest, reply: FastifyReply) => {
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
  },
};

export default handlers;
