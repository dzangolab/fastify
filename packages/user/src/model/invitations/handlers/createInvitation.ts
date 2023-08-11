import { getUsersByEmail } from "supertokens-node/recipe/thirdpartyemailpassword";

import computeAppId from "../../../lib/computeAppId";
import computeInvitationExpiresAt from "../../../lib/computeInvitationExpiresAt";
import getOrigin from "../../../lib/getOrigin";
import sendInvitation from "../../../lib/sendInvitation";
import validateEmail from "../../../validator/email";
import Service from "../service";

import type {
  Invitation,
  InvitationCreateInput,
  InvitationUpdateInput,
} from "../../../types/invitation";
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
    server,
    session,
    slonik,
  } = request;

  try {
    const userId = session && session.getUserId();

    if (!userId) {
      throw new Error("User not found in session");
    }

    const { email, expiresAt, payload, role } = body as InvitationCreateInput;

    let { appId } = body as InvitationCreateInput;

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

    const invitationCreateInput: InvitationCreateInput = {
      email,
      expiresAt: computeInvitationExpiresAt(config, expiresAt),
      invitedById: userId,
      role: role || config.user.role || "USER",
    };

    try {
      if (appId || appId === 0) {
        appId = config.apps?.find((app) => app.id == appId)?.id;

        if (!appId) {
          throw new Error("App does not exist");
        }
      } else {
        const url = headers.referer || headers.origin || hostname;

        const origin = getOrigin(url || "") || config.appOrigin[0];

        // get appId from origin
        appId = computeAppId(config, origin);
      }
    } catch {
      return reply.send({
        status: "ERROR",
        message: "App does not exist",
      });
    }

    invitationCreateInput.appId = appId;

    if (Object.keys(payload || {}).length > 0) {
      invitationCreateInput.payload = JSON.stringify(payload);
    }

    const service = new Service<
      Invitation & QueryResultRow,
      InvitationCreateInput,
      InvitationUpdateInput
    >(config, slonik, dbSchema);

    let invitation: Invitation | undefined;

    try {
      invitation = await service.create(invitationCreateInput);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return reply.send({
        status: "ERROR",
        message: error.message,
      });
    }

    if (invitation) {
      try {
        sendInvitation(server, invitation);
      } catch (error) {
        log.error(error);
      }

      const data: Partial<Invitation> = invitation;

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
