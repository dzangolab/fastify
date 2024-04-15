import { createNewSession } from "supertokens-node/recipe/session";
import { emailPasswordSignUp } from "supertokens-node/recipe/thirdpartyemailpassword";

import { ROLE_ADMIN, ROLE_SUPERADMIN } from "../../../constants";
import getUserService from "../../../lib/getUserService";
import validateEmail from "../../../validator/email";
import validatePassword from "../../../validator/password";
import RoleService from "../../roles/service";

import type { FastifyReply, FastifyRequest } from "fastify";

interface FieldInput {
  email: string;
  password: string;
}

const adminSignUp = async (request: FastifyRequest, reply: FastifyReply) => {
  const { body, config, log, slonik } = request as FastifyRequest<{
    Body: FieldInput;
  }>;
  try {
    const { email, password } = body;

    const userService = getUserService(config, slonik);

    const isAdminExists = await userService.isAdminExists();

    if (isAdminExists) {
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

    const roleService = new RoleService(config, slonik);

    const isSuperadminRole = await roleService.list(undefined, undefined, {
      key: "role",
      operator: "eq",
      value: ROLE_SUPERADMIN,
    });

    // signup
    const signUpResponse = await emailPasswordSignUp(email, password, {
      autoVerifyEmail: true,
      roles: [
        ROLE_ADMIN,
        ...(isSuperadminRole.filteredCount ? [ROLE_SUPERADMIN] : []),
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
    reply.status(500);

    reply.send({
      status: "ERROR",
      message: "Oops! Something went wrong",
    });
  }
};

export default adminSignUp;
