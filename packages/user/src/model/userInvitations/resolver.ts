import jwt from "jsonwebtoken";
import mercurius from "mercurius";
import { getUsersByEmail } from "supertokens-node/recipe/thirdpartyemailpassword";

import sendEmail from "./sendEmail";
import Service from "./service";
import validateEmail from "../../validator/email";

import type { UserInvitationInput } from "../../types/userInvitation";
import type { MercuriusContext } from "mercurius";

const Mutation = {
  sendInvitation: async (
    parent: unknown,
    arguments_: {
      data: UserInvitationInput;
    },
    context: MercuriusContext
  ) => {
    const { email, role } = arguments_.data;

    const { config, database, dbSchema, app, user } = context;

    const service = new Service(config, database, dbSchema);

    try {
      if (user?.id) {
        // Validate the email
        const result = validateEmail(email, config);

        if (!result.success) {
          return result.message;
        }

        // Check if email already registered
        const emailUser = await getUsersByEmail(email);

        if (emailUser[0]) {
          return "Email already registered";
        }

        const token = jwt.sign({ email: email }, config.user.jwtSecret);

        const data = await service.create({
          email,
          invitedBy: user.id,
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
              mailer: app.mailer,
              log: app.log,
              subject: "Invitation for Sign Up",
              templateData: {
                invitationLink,
              },
              templateName: "sign-up-invitation",
              to: email,
            });
          } catch (error) {
            app.log.error(error);
          }

          delete data.token;

          return data;
        }
      }
    } catch (error) {
      // FIXME [OP 28 SEP 2022]
      app.log.error(error);

      const mercuriusError = new mercurius.ErrorWithProps(
        "Oops, Something went wrong"
      );
      mercuriusError.statusCode = 500;

      return mercuriusError;
    }
  },
};

export default { Mutation };
