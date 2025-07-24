import { ROLE_USER } from "../../../constants";
import computeInvitationExpiresAt from "../../../lib/computeInvitationExpiresAt";
import getInvitationService from "../../../lib/getInvitationService";
import getUserService from "../../../lib/getUserService";
import sendInvitation from "../../../lib/sendInvitation";
import validateEmail from "../../../validator/email";

import type {
  Invitation,
  InvitationCreateInput,
} from "../../../types/invitation";
import type { FilterInput } from "@prefabs.tech/fastify-slonik";
import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const createInvitation = async (
  request: SessionRequest,
  reply: FastifyReply,
) => {
  const {
    body,
    config,
    dbSchema,
    headers,
    hostname,
    log,
    server,
    slonik,
    user,
  } = request;

  try {
    if (!user) {
      return reply.status(401).send({
        error: "Unauthorized",
        message: "unauthorized",
        statusCode: 401,
      });
    }

    const { appId, email, expiresAt, payload, role } =
      body as InvitationCreateInput;

    //  check if the email is valid
    const result = validateEmail(email, config);

    if (!result.success) {
      return reply.status(422).send({
        statusCode: 422,
        status: "ERROR",
        message: result.message,
      });
    }

    const userService = getUserService(config, slonik, dbSchema);

    const emailFilter = {
      key: "email",
      operator: "eq",
      value: email,
    } as FilterInput;

    const userCount = await userService.count(emailFilter);

    // check if user of the email already exists
    if (userCount > 0) {
      return reply.status(422).send({
        statusCode: 422,
        status: "ERROR",
        message: `User with email ${email} already exists`,
      });
    }

    const service = getInvitationService(config, slonik, dbSchema);

    const invitationCreateInput: InvitationCreateInput = {
      email,
      expiresAt: computeInvitationExpiresAt(config, expiresAt),
      invitedById: user.id,
      role: role || config.user.role || ROLE_USER,
    };

    const app = config.apps?.find((app) => app.id == appId);

    if (app) {
      if (app.supportedRoles.includes(invitationCreateInput.role)) {
        invitationCreateInput.appId = appId;
      } else {
        return reply.status(422).send({
          statusCode: 422,
          status: "ERROR",
          message: `App ${app.name} does not support role ${invitationCreateInput.role}`,
        });
      }
    }

    if (Object.keys(payload || {}).length > 0) {
      invitationCreateInput.payload = JSON.stringify(payload);
    }

    let invitation: Invitation | undefined;

    try {
      invitation = await service.create(invitationCreateInput);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      log.error(error);

      return reply.status(422).send({
        statusCode: 422,
        status: "ERROR",
        message: error.message,
      });
    }

    if (invitation) {
      const url = headers.referer || headers.origin || hostname;

      try {
        sendInvitation(server, invitation, url);
      } catch (error) {
        log.error(error);
      }

      const data: Partial<Invitation> = invitation;

      delete data.token;

      reply.send(data);
    }
  } catch (error) {
    log.error(error);

    reply.status(500).send({
      message: "Oops! Something went wrong",
      status: "ERROR",
      statusCode: 500,
    });
  }
};

export default createInvitation;
