import { FastifyReply } from "fastify";
import { updateEmailOrPassword } from "supertokens-node/recipe/thirdpartyemailpassword";

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

    const emailValidationResult = validateEmail(email, config);

    if (!emailValidationResult.success) {
      return reply.status(422).send({
        statusCode: 422,
        status: "ERROR",
        message: emailValidationResult.message,
      });
    }

    const response = await updateEmailOrPassword({
      userId: user.id,
      email: email,
    });

    if (response.status === "OK") {
      const userService = getUserService(config, slonik);

      const userData = await userService.changeEmail(user.id, { email });

      request.user = userData;
    }

    return reply.send(response);
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
