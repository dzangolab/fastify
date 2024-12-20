import { createNewSession } from "supertokens-node/recipe/session";
import { emailPasswordSignUp } from "supertokens-node/recipe/thirdpartyemailpassword";
import UserRoles from "supertokens-node/recipe/userroles";

import { ROLE_ADMIN, ROLE_SUPERADMIN } from "../../../constants";
import validateEmail from "../../../validator/email";
import validatePassword from "../../../validator/password";

import type { FastifyReply, FastifyRequest } from "fastify";

interface FieldInput {
  email: string;
  password: string;
}

const adminSignUp = async (request: FastifyRequest, reply: FastifyReply) => {
  const { body, config, log } = request as FastifyRequest<{
    Body: FieldInput;
  }>;
  try {
    const { email, password } = body;

    // check if already admin user exists
    const adminUsers = await UserRoles.getUsersThatHaveRole(ROLE_ADMIN);
    const superAdminUsers =
      await UserRoles.getUsersThatHaveRole(ROLE_SUPERADMIN);

    if (
      adminUsers.status === "UNKNOWN_ROLE_ERROR" &&
      superAdminUsers.status === "UNKNOWN_ROLE_ERROR"
    ) {
      return reply.status(422).send({
        statusCode: 422,
        status: "ERROR",
        message: adminUsers.status,
      });
    } else if (
      (adminUsers.status === "OK" && adminUsers.users.length > 0) ||
      (superAdminUsers.status === "OK" && superAdminUsers.users.length > 0)
    ) {
      return reply.status(409).send({
        statusCode: 409,
        status: "ERROR",
        message: "First admin user already exists",
      });
    }

    //  check if the email is valid
    const emailResult = validateEmail(email, config);

    if (!emailResult.success) {
      return reply.status(422).send({
        statusCode: 422,
        status: "ERROR",
        message: emailResult.message,
      });
    }

    // password strength validation
    const passwordStrength = validatePassword(password, config);

    if (!passwordStrength.success) {
      return reply.status(422).send({
        statusCode: 422,
        status: "ERROR",
        message: passwordStrength.message,
      });
    }

    // signup
    const signUpResponse = await emailPasswordSignUp(email, password, {
      autoVerifyEmail: true,
      roles: [
        ROLE_ADMIN,
        ...(superAdminUsers.status === "OK" ? [ROLE_SUPERADMIN] : []),
      ],
      _default: {
        request: {
          request,
        },
      },
    });

    if (signUpResponse.status !== "OK") {
      return reply.send(signUpResponse);
    }

    // create new session so the user be logged in on signup
    await createNewSession(request, reply, signUpResponse.user.id);

    reply.send(signUpResponse);
  } catch (error) {
    log.error(error);

    reply.status(500).send({
      message: "Oops! Something went wrong",
      status: "ERROR",
      statusCode: 500,
    });
  }
};

export default adminSignUp;
