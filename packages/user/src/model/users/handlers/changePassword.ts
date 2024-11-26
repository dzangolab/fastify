import { createNewSession } from "supertokens-node/recipe/session";

import getUserService from "../../../lib/getUserService";
import createUserContext from "../../../supertokens/utils/createUserContext";

import type { ChangePasswordInput } from "../../../types";
import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const changePassword = async (request: SessionRequest, reply: FastifyReply) => {
  try {
    const session = request.session;
    const requestBody = request.body as ChangePasswordInput;
    const userId = session && session.getUserId();

    if (!userId) {
      reply.status(403).send({
        statusCode: 403,
        error: "unauthenticated",
        message: "Please login to continue",
      });

      return;
    }

    const oldPassword = requestBody.oldPassword ?? "";
    const newPassword = requestBody.newPassword ?? "";

    const service = getUserService(
      request.config,
      request.slonik,
      request.dbSchema,
    );

    const response = await service.changePassword(
      userId,
      oldPassword,
      newPassword,
    );

    if (response.status === "OK") {
      await createNewSession(
        request,
        reply,
        userId,
        undefined,
        undefined,
        createUserContext(undefined, request),
      );
    }

    reply.send(response);
  } catch (error) {
    request.log.error(error);
    reply.status(500);

    reply.send({
      status: "ERROR",
      message: "Oops! Something went wrong",
      error,
    });
  }
};

export default changePassword;
