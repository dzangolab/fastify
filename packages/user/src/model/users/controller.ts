import { wrapResponse } from "supertokens-node/framework/fastify";
import Session from "supertokens-node/recipe/session";

import Service from "./service";
import { changePassword } from "../../types";

import type { FastifyInstance, FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const plugin = async (
  fastify: FastifyInstance,
  options: unknown,
  done: () => void
) => {
  const ROUTE_CHANGE_PASSWORD = "/change_password";
  const ROUTE_CURRENT_USER = "/me";

  fastify.post(
    ROUTE_CHANGE_PASSWORD,
    {
      preHandler: fastify.verifySession(),
    },
    async (request: SessionRequest, reply: FastifyReply) => {
      try {
        const session = request.session;
        const requestBody = request.body as changePassword;
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
    ROUTE_CURRENT_USER,
    {
      preHandler: fastify.verifySession(),
    },
    async (request: SessionRequest, reply: FastifyReply) => {
      const service = new Service(request.config, request.slonik);

      const session = await Session.getSession(request, wrapResponse(reply), {
        sessionRequired: false,
      });

      const userId = session?.getUserId();

      if (userId) {
        return service.currentUser(userId);
      }
    }
  );

  done();
};

export default plugin;
