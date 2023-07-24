import { getUsersByEmail } from "supertokens-node/recipe/thirdpartyemailpassword";

import sendEmail from "../../../lib/sendEmail";
import formatDate from "../../../supertokens/utils/formatDate";
import getOrigin from "../../../supertokens/utils/getOrigin";
import validateEmail from "../../../validator/email";
import Service from "../service";
import computeInvitationExpiresAt from "../utils/computeInvitationExpiresAt";
import getInvitationLink from "../utils/getInvitationLink";

import type {
  Invitation,
  InvitationCreateInput,
  InvitationUpdateInput,
} from "../../../types/invitation";
import type { FilterInput } from "@dzangolab/fastify-slonik";
import type { FastifyReply } from "fastify";
import type { QueryResultRow } from "slonik";
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

    // check if user of the email already exists
    const emailUser = await getUsersByEmail(email);

    if (emailUser.length > 0) {
      return reply.send({
        status: "ERROR",
        message: `User with email ${email} already exists`,
      });
    }

    const service = new Service<
      Invitation & QueryResultRow,
      InvitationCreateInput,
      InvitationUpdateInput
    >(config, slonik, dbSchema);

    const filters = {
      AND: [
        { key: "email", operator: "eq", value: email },
        { key: "acceptedAt", operator: "eq", value: "null" },
        { key: "expiresAt", operator: "gt", value: formatDate(new Date()) },
        { key: "revokedAt", operator: "eq", value: "null" },
      ],
    } as FilterInput;

    const validInvitationCount = await service.count(filters);

    // only one valid invitation is allowed per email
    if (validInvitationCount > 0) {
      return reply.send({
        status: "ERROR",
        message: "Invitation already exist",
      });
    }

    const invitationCreateInput: InvitationCreateInput = {
      // eslint-disable-next-line unicorn/no-null
      appId: appId || (null as unknown as undefined),
      email,
      expiresAt: computeInvitationExpiresAt(config, expiresAt),
      invitedById: userId,
      role: role || config.user.role || "USER",
    };

    if (Object.keys(payload || {}).length > 0) {
      invitationCreateInput.payload = JSON.stringify(payload);
    }

    let invitation: Invitation | undefined;

    try {
      invitation = await service.create(invitationCreateInput);
    } catch {
      return reply.send({
        status: "ERROR",
        message: "Check your input",
      });
    }

    if (invitation) {
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
            invitationLink: getInvitationLink(config, invitation.token, origin),
          },
          templateName: "user-invitation",
          to: email,
        });
      } catch (error) {
        log.error(error);
      }

      const response: Partial<Invitation> = invitation;

      delete response.token;

      reply.send(response);
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
