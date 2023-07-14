import { getUsersByEmail } from "supertokens-node/recipe/thirdpartyemailpassword";

import validateEmail from "../../../validator/email";
import Service from "../service";
import getExpireTime from "../utils/getExpireTime";
import getInvitationLink from "../utils/getInvitationLink";
import sendEmail from "../utils/sendEmail";

import type {
  Invitation,
  InvitationCreateInput,
  InvitationInput,
} from "../../../types/invitation";
import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const createInvitation = async (
  request: SessionRequest,
  reply: FastifyReply
) => {
  const { body, config, dbSchema, log, mailer, session, slonik } = request;

  try {
    const userId = session && session.getUserId();

    if (!userId) {
      throw new Error("User not found in session");
    }

    const { appId, email, expiresAt, payload, role } = body as InvitationInput;

    //  check if the email is valid
    const result = validateEmail(email, config);

    if (!result.success) {
      return reply.send({
        status: "ERROR",
        message: result.message,
      });
    }

    // check if user of the email already exists
    const emailUser = await getUsersByEmail(email);

    if (emailUser.length > 0) {
      return reply.send({
        status: "ERROR",
        message: `User with email ${email} already exists`,
      });
    }

    const service = new Service(config, slonik, dbSchema);

    let data: Partial<Invitation> | undefined;

    const invitationCreateInput: InvitationCreateInput = {
      appId,
      email,
      expiresAt: getExpireTime(config, expiresAt),
      invitedById: userId,
      role: role || config.user.role || "USER",
    };

    if (Object.keys(payload || {}).length > 0) {
      invitationCreateInput.payload = JSON.stringify(payload);
    }

    try {
      data = (await service.create(invitationCreateInput)) as
        | Invitation
        | undefined;
    } catch {
      return reply.send({
        status: "ERROR",
        message: "Check your input.",
      });
    }

    if (data && data.token) {
      try {
        sendEmail({
          config,
          mailer,
          log,
          subject: "Invitation for Sign Up",
          templateData: {
            invitationLink: getInvitationLink(appId, data.token, config),
          },
          templateName: "create-invitation",
          to: email,
        });
      } catch (error) {
        log.error(error);
      }

      delete data.token;

      reply.send(data);
    }
  } catch (error) {
    log.error(error);
    reply.status(500);

    reply.send({
      status: "ERROR",
      message: "Oops! Something went wrong",
    });
  }
};

export default createInvitation;
