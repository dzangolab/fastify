import Service from "../service";

import type { ChangePasswordInput } from "../../../types";
import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const changePassword = async (request: SessionRequest, reply: FastifyReply) => {
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
    const data = await service.changePassword(userId, oldPassword, newPassword);

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
};

export default changePassword;
