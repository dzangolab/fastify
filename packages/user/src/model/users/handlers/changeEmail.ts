import { FastifyReply } from "fastify";
import EmailVerification, {
  EmailVerificationClaim,
  isEmailVerified,
} from "supertokens-node/recipe/emailverification";
import { updateEmailOrPassword } from "supertokens-node/recipe/thirdpartyemailpassword";

import getUserService from "../../../lib/getUserService";
import createUserContext from "../../../supertokens/utils/createUserContext";
import ProfileValidationClaim from "../../../supertokens/utils/profileValidationClaim";
import validateEmail from "../../../validator/email";

import type { ChangeEmailInput } from "../../../types";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const changeEmail = async (request: SessionRequest, reply: FastifyReply) => {
  const { body, config, log, user, slonik } = request;

  try {
    if (!user) {
      return reply.status(401).send({
        error: "Unauthorised",
        message: "unauthorised",
      });
    }

    if (request.config.user.features?.profileValidation?.enabled) {
      console.log("here");
      await request.session?.fetchAndSetClaim(
        new ProfileValidationClaim(),
        createUserContext(undefined, request),
      );
    }

    if (request.config.user.features?.signUp?.emailVerification) {
      console.log("there");

      await request.session?.fetchAndSetClaim(
        EmailVerificationClaim,
        createUserContext(undefined, request),
      );
    }

    const email = (body as ChangeEmailInput).email ?? "";

    const emailValidationResult = validateEmail(email, config);

    if (!emailValidationResult.success) {
      return reply.status(422).send({
        statusCode: 422,
        status: "ERROR",
        message: emailValidationResult.message,
      });
    }

    if (config.user.features?.signUp?.emailVerification) {
      const isVerified = await isEmailVerified(user.id, email);

      if (!isVerified) {
        const tokenResponse =
          await EmailVerification.createEmailVerificationToken(user.id, email);

        if (tokenResponse.status === "OK") {
          await EmailVerification.sendEmail({
            type: "EMAIL_VERIFICATION",
            user: {
              id: user.id,
              email: email,
            },
            emailVerifyLink: `${config.appOrigin[0]}/auth/verify-email?token=${tokenResponse.token}&rid=emailverification`,
          });

          return reply.send({
            status: "OK",
            message: "A verification link has been sent to your email.",
          });
        }

        return reply.send(tokenResponse.status);
      }
    }

    const response = await updateEmailOrPassword({
      userId: user.id,
      email: email,
    });

    if (response.status === "OK") {
      const userService = getUserService(config, slonik);

      const userData = await userService.changeEmail(user.id, { email });

      request.user = userData;

      return reply.send({
        status: "OK",
        message: "Successfully updated email address.",
      });
    }

    return reply.send(response);
  } catch (error) {
    log.error(error);

    reply.status(500).send({
      message: "Oops! Something went wrong",
      status: "ERROR",
      statusCode: 500,
    });
  }
};

export default changeEmail;
