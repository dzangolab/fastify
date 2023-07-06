import { getUsersByEmail } from "supertokens-node/recipe/thirdpartyemailpassword";

import validateEmail from "../../../validator/email";
import sendEmail from "../sendEmail";
import Service from "../service";
import getInvitationLink from "../utils/getInvitationLink";

import type { Invitation, InvitationInput } from "../../../types/invitation";
import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const sendInvitation = async (request: SessionRequest, reply: FastifyReply) => {
  const { body, config, dbSchema, log, mailer, session, slonik } = request;

  try {
    const userId = session && session.getUserId();

    if (!userId) {
      throw new Error("User not found in session");
    }

    const { appId, email, expiresAt, invitedById, payload, role } =
      body as InvitationInput;

    // Validate the email
    const result = validateEmail(email, config);

    if (!result.success) {
      reply.send({
        status: "ERROR",
        message: result.message,
      });
    }

    // Check if email already registered
    const user = await getUsersByEmail(email);

    if (user[0]) {
      reply.send({
        status: "ERROR",
        message: "Email already registered",
      });
    }

    const service = new Service(config, slonik, dbSchema);

    let data: Partial<Invitation> | undefined;

    try {
      data = (await service.create({
        appId,
        email,
        expiresAt,
        invitedById,
        payload,
        role: role || config.user.role || "USER",
      })) as Invitation | undefined;
    } catch {
      reply.send({
        status: "ERROR",
        message: "Cannot send invitation more than once",
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
            invitationLink: getInvitationLink(appId),
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

export default sendInvitation;
