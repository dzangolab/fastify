import { createNewSession } from "supertokens-node/recipe/session";
import { emailPasswordSignUp } from "supertokens-node/recipe/thirdpartyemailpassword";
import UserRoles from "supertokens-node/recipe/userroles";

import formatDate from "../../../supertokens/utils/formatDate";
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

    // password strength validation
    const passwordStrength = validatePassword(password, config);
    if (!passwordStrength.success) {
      reply.send({
        status: "ERROR",
        message: passwordStrength.message,
      });
    }

    const service = new Service(config, slonik, dbSchema);

    const invitation = (await service.findByToken(token)) as Invitation | null;

    // validate the invitation
    if (!invitation || !isInvitationValid(invitation)) {
      reply.send({
        status: "ERROR",
        message: "Token invalid or expired",
      });

      return;
    }

    // match the FieldInput email and invitation email
    if (invitation.email != email) {
      reply.send({
        status: "ERROR",
        message: "Email do not match with the invitation",
      });
    }

    // signup
    const signupResult = await emailPasswordSignUp(email, password);

    if (!(signupResult.status === "OK")) {
      reply.send({
        status: "ERROR",
        message: "Something Went wrong while signing up",
      });

      return;
    }

    // delete the default role
    await UserRoles.removeUserRole(
      signupResult.user.id,
      config.user.role || "USER"
    );

    // add role from invitation
    await UserRoles.addRoleToUser(signupResult.user.email, invitation.role);

    // update invitation's acceptedAt value with current time
    await service.update(invitation.id, {
      acceptedAt: formatDate(new Date(Date.now())),
    });

    await createNewSession(request, reply, signupResult.user.id);

    reply.send(signupResult);
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
