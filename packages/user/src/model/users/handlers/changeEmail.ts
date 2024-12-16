import { FastifyReply } from "fastify";
import EmailPassword from "supertokens-node/recipe/emailpassword";

import getUserService from "../../../lib/getUserService";
import validateEmail from "../../../validator/email";

import type { ChangeEmailInput } from "../../../types";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const changeEmail = async (request: SessionRequest, reply: FastifyReply) => {
  const { body, config, log, user, slonik } = request;

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

    const response = await EmailPassword.updateEmailOrPassword({
      userId: user.id,
      email: email,
    });

    if (response.status === "OK") {
      const userService = getUserService(config, slonik);

      const userData = await userService.update(user.id, { email: email });

      if (!userData) {
        throw new Error("User not found");
      }

      return reply.status(200).send({
        statusCode: 200,
        status: "SUCCESS",
      });
    }

    if (response.status === "EMAIL_ALREADY_EXISTS_ERROR") {
      return reply.send({
        message: response.status,
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
