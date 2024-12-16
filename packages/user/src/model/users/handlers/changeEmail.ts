import validateEmail from "../../../validator/email";

import type { ChangeEmailInput } from "../../../types";
import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const changeEmail = async (request: SessionRequest, reply: FastifyReply) => {
  const { body, config, log, user } = request;

  try {
    if (!user) {
      return reply.status(401).send({
        error: "Unauthorised",
        message: "unauthorised",
      });
    }

    const email = (body as ChangeEmailInput).email ?? "";

    const emailResult = validateEmail(email, config);

    if (!emailResult.success) {
      return reply.status(422).send({
        statusCode: 422,
        status: "ERROR",
        message: emailResult.message,
      });
    }
  } catch (error) {
    log.error(error);

    reply.status(500).send({
      message: "Oops! Something went wrong",
      status: "ERROR",
      statusCode: 500,
    });
  }
};

export default changeEmail;
