import formatDate from "../../../supertokens/utils/formatDate";
import validateEmail from "../../../validator/email";
import Service from "../service";
import getInvitationLink from "../utils/getInvitationLink";
import sendEmail from "../utils/sendEmail";

import type { Invitation, InvitationInput } from "../../../types/invitation";
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

    // Validate the email
    const result = validateEmail(email, config);

    if (!result.success) {
      reply.send({
        status: "ERROR",
        message: result.message,
      });
    }

    const service = new Service(config, slonik, dbSchema);

    let data: Partial<Invitation> | undefined;

    const expireTime =
      expiresAt ||
      formatDate(
        new Date(
          Date.now() +
            (config.user.invitation.expireAfterInDays ?? 30) *
              (24 * 60 * 60 * 1000)
        )
      );

    try {
      data = (await service.create({
        appId,
        email,
        expiresAt: expireTime,
        invitedById: userId,
        payload: JSON.stringify(payload),
        role: role || config.user.role || "USER",
      })) as Invitation | undefined;
    } catch {
      reply.send({
        status: "ERROR",
        message: "Database error! Check you input.",
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
            invitationLink: `${getInvitationLink(appId)}?token=${data.token}`,
          },
          templateName: "sign-up-invitation",
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
