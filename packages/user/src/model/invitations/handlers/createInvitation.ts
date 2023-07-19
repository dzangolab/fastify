import { getUsersByEmail } from "supertokens-node/recipe/thirdpartyemailpassword";

import sendEmail from "../../../lib/sendEmail";
import getOrigin from "../../../supertokens/utils/getOrigin";
import validateEmail from "../../../validator/email";
import Service from "../service";
import computeInvitationExpiresAt from "../utils/computeInvitationExpiresAt";
import getInvitationLink from "../utils/getInvitationLink";

import type {
  Invitation,
  InvitationCreateInput,
} from "../../../types/invitation";
import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const createInvitation = async (
  request: SessionRequest,
  reply: FastifyReply
) => {
  const {
    body,
    config,
    dbSchema,
    headers,
    hostname,
    log,
    mailer,
    session,
    slonik,
  } = request;

  try {
    const userId = session && session.getUserId();

    if (!userId) {
      throw new Error("User not found in session");
    }

    const { appId, email, expiresAt, payload, role } =
      body as InvitationCreateInput;

    //  check if the email is valid
    const result = validateEmail(email, config);

    if (!result.success) {
      return reply.send({
        status: "ERROR",
        message: result.message,
      });
    }

    // [DU 2023-JUL-19] TODO: ensure that only one valid invitation
    // is allowed per email address

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
      email,
      expiresAt: computeInvitationExpiresAt(config, expiresAt),
      invitedById: userId,
      role: role || config.user.role || "USER",
    };

    if (appId) {
      invitationCreateInput.appId = appId;
    }

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
        message: "Check your input",
      });
    }

    if (data && data.token) {
      try {
        const url = headers.referer || headers.origin || hostname;

        const origin = getOrigin(url) || config.appOrigin[0];

        // send invitation email
        sendEmail({
          config,
          mailer,
          log,
          subject: "Invitation for Sign Up",
          templateData: {
            invitationLink: getInvitationLink(config, data.token, origin),
          },
          templateName: "user-invitation",
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
