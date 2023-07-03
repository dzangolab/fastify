import jwt from "jsonwebtoken";
import { getUsersByEmail } from "supertokens-node/recipe/thirdpartyemailpassword";

import validateEmail from "../../../validator/email";
import sendEmail from "../sendEmail";
import Service from "../service";

import type {
  UserInvitation,
  UserInvitationInput,
} from "../../../types/userInvitation";
import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const sendInvitation = async (request: SessionRequest, reply: FastifyReply) => {
  const { body, config, dbSchema, log, mailer, session, slonik } = request;

  try {
    const userId = session && session.getUserId();

    if (!userId) {
      throw new Error("User not found in session");
    }

    const { email, role } = body as UserInvitationInput;

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

    const token = jwt.sign({ email: email }, config.user.jwtSecret);

    let data: Partial<UserInvitation> | undefined;

    try {
      data = (await service.create({
        email,
        invitedBy: userId,
        role: role || config.user.role || "USER",
        token,
      })) as UserInvitation | undefined;
    } catch {
      reply.send({
        status: "ERROR",
        message: "Cannot send invitation more than once",
      });
    }

    if (data && data.token) {
      const invitationLink =
        config.appOrigin[0] +
        (config.user.invitationSignupPath || "/register") +
        `?token=${data.token}`;

      try {
        sendEmail({
          config,
          mailer,
          log,
          subject: "Invitation for Sign Up",
          templateData: {
            invitationLink,
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
