import { createNewSession } from "supertokens-node/recipe/session";
import { emailPasswordSignUp } from "supertokens-node/recipe/thirdpartyemailpassword";
import UserRoles from "supertokens-node/recipe/userroles";

import { ROLE_ADMIN, ROLE_SUPER_ADMIN } from "../../../constants";
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
    const superAdminUsers = await UserRoles.getUsersThatHaveRole(
      ROLE_SUPER_ADMIN
    );

    if (
      adminUsers.status === "UNKNOWN_ROLE_ERROR" &&
      superAdminUsers.status === "UNKNOWN_ROLE_ERROR"
    ) {
      return reply.send({
        status: "ERROR",
        message: adminUsers.status,
      });
    } else if (
      (adminUsers.status === "OK" && adminUsers.users.length > 0) ||
      (superAdminUsers.status === "OK" && superAdminUsers.users.length > 0)
    ) {
      return reply.send({
        status: "ERROR",
        message: "First admin user already exists",
      });
    }

    //  check if the email is valid
    const emailResult = validateEmail(email, config);

    if (!emailResult.success) {
      return reply.send({
        status: "ERROR",
        message: emailResult.message,
      });
    }

    // password strength validation
    const passwordStrength = validatePassword(password, config);

    if (!passwordStrength.success) {
      return reply.send({
        status: "ERROR",
        message: passwordStrength.message,
      });
    }

    // signup
    const signUpResponse = await emailPasswordSignUp(email, password, {
      autoVerifyEmail: true,
      roles: [
        ROLE_ADMIN,
        ...(superAdminUsers.status === "OK" ? [ROLE_SUPER_ADMIN] : []),
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

    reply.send({
      ...signUpResponse,
      user: {
        ...signUpResponse.user,
        roles: [ROLE_ADMIN, ROLE_SUPER_ADMIN],
      },
    });
  } catch (error) {
    log.error(error);
    reply.status(500);

    reply.send({
      status: "ERROR",
      message: "Oops! Something went wrong",
    });
  }
};

export default adminSignUp;
