import jwt from "jsonwebtoken";
import { getUsersByEmail } from "supertokens-node/recipe/thirdpartyemailpassword";

import validateEmail from "../../../validator/email";
import sendEmail from "../sendEmail";
import Service from "../service";

import type { UserInvitationInput } from "../../../types/userInvitation";
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
      return result.message;
    }

    // Check if email already registered
    const user = await getUsersByEmail(email);

    if (user[0]) {
      return "Email already registered";
    }

    const service = new Service(config, slonik, dbSchema);

    const token = jwt.sign({ email: email }, config.user.jwtSecret);

    const data = await service.create({
      email,
      invitedBy: userId,
      role: role || "USER",
      token,
    });

    if (data) {
      const invitationLink = config.user.invitationSignupLink
        ? `${config.user.invitationSignupLink}?token=${data.token}`
        : `${config.appOrigin[0]}/register?token=${data.token}`;

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
