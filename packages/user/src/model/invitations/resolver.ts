// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// [DU 2034-JUL-07] Todo: Complete after the route is completed
import mercurius from "mercurius";

import Service from "./service";
import getInvitationLink from "./utils/getInvitationLink";
import sendEmail from "./utils/sendEmail";
import validateEmail from "../../validator/email";

import type { Invitation, InvitationInput } from "../../types/invitation";
import type { MercuriusContext } from "mercurius";

const Mutation = {
  sendInvitation: async (
    parent: unknown,
    arguments_: {
      data: InvitationInput;
    },
    context: MercuriusContext
  ) => {
    const { appId, email, expiresAt, payload, role } = arguments_.data;

    const { config, database, dbSchema, app, user } = context;

    const service = new Service(config, database, dbSchema);

    try {
      if (user?.id) {
        // Validate the email
        const result = validateEmail(email, config);

        if (!result.success) {
          const mercuriusError = new mercurius.ErrorWithProps(
            result.message || ""
          );
          mercuriusError.statusCode = 500;

          return mercuriusError;
        }

        let data: Partial<Invitation> | undefined;

        try {
          data = (await service.create({
            appId,
            email,
            expiresAt,
            invitedById: user.id,
            payload,
            role: role || config.user.role || "USER",
          })) as Invitation | undefined;
        } catch {
          const mercuriusError = new mercurius.ErrorWithProps(
            "Database error! Check you input."
          );
          mercuriusError.statusCode = 500;

          return mercuriusError;
        }

        if (data && data.token) {
          try {
            sendEmail({
              config,
              mailer: app.mailer,
              log: app.log,
              subject: "Invitation for Sign Up",
              templateData: {
                invitationLink: getInvitationLink(appId),
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
