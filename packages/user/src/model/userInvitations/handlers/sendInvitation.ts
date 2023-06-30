import sendEmail from "../sendEmail";
import Service from "../service";

import type { UserInvitationCreateInput } from "../../../types/userInvitation";
import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const sendInvitation = async (request: SessionRequest, reply: FastifyReply) => {
  try {
    const session = request.session;
    const requestBody = request.body as UserInvitationCreateInput;
    const userId = session && session.getUserId();

    if (!userId) {
      throw new Error("User not found in session");
    }

    const { email, role } = requestBody;

    const service = new Service(
      request.config,
      request.slonik,
      request.dbSchema
    );

    const data = await service.create({ email, invitedBy: userId, role });

    const invitationLink = "http://localhost:3333/signup?token=111";

    try {
      sendEmail({
        request,
        subject: "Invitation for Sign Up",
        templateData: {
          invitationLink,
        },
        templateName: "sign-up-invitation",
        to: email,
      });
    } catch (error) {
      request.log.error(error);
    }

    if (data) {
      delete data.token;

      reply.send(data);
    }
  } catch (error) {
    request.log.error(error);
    reply.status(500);

    reply.send({
      status: "ERROR",
      message: "Oops! Something went wrong",
      error,
    });
  }
};

export default sendInvitation;
