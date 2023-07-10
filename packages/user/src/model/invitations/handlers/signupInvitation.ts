import { emailPasswordSignUp } from "supertokens-node/recipe/thirdpartyemailpassword";
import UserRoles from "supertokens-node/recipe/userroles";

import formatDate from "../../../supertokens/utils/formatDate";
import Service from "../service";
import isInvitationValid from "../utils/isInvitationValid";

import type { Invitation } from "../../../types/invitation";
import type { FastifyReply, FastifyRequest } from "fastify";

interface FieldInput {
  email: string;
  password: string;
  token: string;
}

const signupInvitation = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { body, config, dbSchema, log, slonik } = request as FastifyRequest<{
    Body: FieldInput;
  }>;

  try {
    const { email, password, token } = body;

    const service = new Service(config, slonik, dbSchema);

    const invitation = (await service.findByToken(token)) as Invitation | null;

    // validate the invitation
    if (!invitation || !isInvitationValid(invitation)) {
      reply.send({
        status: "ERROR",
        message: "Token Invalid/Expired",
      });

      return;
    }

    // match the FieldInput email and invitation email

    // signup
    const signupResult = await emailPasswordSignUp(email, password);

    if (!(signupResult.status === "OK")) {
      reply.send({
        status: "ERROR",
        message: "Something Went wrong while signing up",
      });

      return;
    }

    // update the user role
    await UserRoles.addRoleToUser(signupResult.user.id, invitation.role);

    // update invitation's accecptedAt value to current time
    await service.update(invitation.id, {
      accecptedAt: formatDate(new Date(Date.now())),
    });

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

export default signupInvitation;
