import { createNewSession } from "supertokens-node/recipe/session";
import { emailPasswordSignUp } from "supertokens-node/recipe/thirdpartyemailpassword";
import UserRoles from "supertokens-node/recipe/userroles";

import formatDate from "../../../supertokens/utils/formatDate";
import validateEmail from "../../../validator/email";
import validatePassword from "../../../validator/password";
import Service from "../service";
import isInvitationValid from "../utils/isInvitationValid";

import type { Invitation } from "../../../types/invitation";
import type { FastifyReply, FastifyRequest } from "fastify";

interface FieldInput {
  email: string;
  password: string;
}

const acceptInvitation = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { body, config, dbSchema, log, params, slonik } =
    request as FastifyRequest<{
      Body: FieldInput;
    }>;

  const { token } = params as { token: string };

  try {
    const { email, password } = body;

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

    const service = new Service(config, slonik, dbSchema);

    const data = (await service.findByToken(token)) as Invitation | null;

    // validate the invitation
    if (!data || !isInvitationValid(data)) {
      return reply.send({
        status: "ERROR",
        message: "Token invalid or expired",
      });
    }

    // compare the FieldInput email to the invitation email
    if (data.email != email) {
      return reply.send({
        status: "ERROR",
        message: "Email do not match with the invitation",
      });
    }

    // signup
    const signUpResult = await emailPasswordSignUp(email, password);

    if (!(signUpResult.status === "OK")) {
      return reply.send({
        status: "ERROR",
        message: "Something Went wrong while signing up",
      });
    }

    // delete the default role
    await UserRoles.removeUserRole(
      signUpResult.user.id,
      config.user.role || "USER"
    );

    // add role from invitation
    await UserRoles.addRoleToUser(signUpResult.user.id, data.role);

    // update invitation's acceptedAt value with current time
    await service.update(data.id, {
      acceptedAt: formatDate(new Date(Date.now())),
    });

    await createNewSession(request, reply, signUpResult.user.id);

    reply.send({
      ...signUpResult,
      user: {
        ...signUpResult.user,
        roles: [data.role],
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

export default acceptInvitation;
