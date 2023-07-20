import { createNewSession } from "supertokens-node/recipe/session";
import { emailPasswordSignUp } from "supertokens-node/recipe/thirdpartyemailpassword";
import UserRoles from "supertokens-node/recipe/userroles";

import formatDate from "../../../supertokens/utils/formatDate";
import validateEmail from "../../../validator/email";
import validatePassword from "../../../validator/password";
import Service from "../service";
import isInvitationValid from "../utils/isInvitationValid";

import type {
  Invitation,
  InvitationCreateInput,
  InvitationUpdateInput,
} from "../../../types/invitation";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { QueryResultRow } from "slonik";

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

    const service = new Service<
      Invitation & QueryResultRow,
      InvitationCreateInput,
      InvitationUpdateInput
    >(config, slonik, dbSchema);

    const invitation = await service.findByToken(token);

    // validate the invitation
    if (!invitation || !isInvitationValid(invitation)) {
      return reply.send({
        status: "ERROR",
        message: "Invitation is invalid or has expired",
      });
    }

    // compare the FieldInput email to the invitation email
    if (invitation.email != email) {
      return reply.send({
        status: "ERROR",
        message: "Email do not match with the invitation",
      });
    }

    // signup
    const signUpResult = await emailPasswordSignUp(email, password);

    if (!(signUpResult.status === "OK")) {
      return reply.send(signUpResult);
    }

    const { roles } = await UserRoles.getRolesForUser(signUpResult.user.id);

    // delete user role (default) if it do not match with the invitation role
    if (roles[0] != invitation.role) {
      await UserRoles.removeUserRole(signUpResult.user.id, roles[0]);

      // add role from invitation
      await UserRoles.addRoleToUser(signUpResult.user.id, invitation.role);
    }

    // update invitation's acceptedAt value with current time
    await service.update(invitation.id, {
      acceptedAt: formatDate(new Date(Date.now())) as unknown as string,
    });

    // create new session so the user be logged in on signup
    await createNewSession(request, reply, signUpResult.user.id);

    reply.send({
      ...signUpResult,
      user: {
        ...signUpResult.user,
        roles: [invitation.role],
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
