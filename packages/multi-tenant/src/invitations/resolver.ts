import { formatDate } from "@dzangolab/fastify-slonik";
import {
  isInvitationValid,
  validateEmail,
  validatePassword,
  InvitationService as Service,
} from "@dzangolab/fastify-user";
import mercurius from "mercurius";
import { createNewSession } from "supertokens-node/recipe/session";
import { emailPasswordSignUp } from "supertokens-node/recipe/thirdpartyemailpassword";

import type {
  User,
  Invitation,
  InvitationCreateInput,
  InvitationUpdateInput,
} from "@dzangolab/fastify-user";
import type { MercuriusContext } from "mercurius";
import type { QueryResultRow } from "slonik";

const Mutation = {
  acceptInvitation: async (
    parent: unknown,
    arguments_: {
      data: {
        email: string;
        password: string;
      };
      token: string;
    },
    context: MercuriusContext
  ) => {
    const { app, config, database, dbSchema, reply } = context;

    const { token, data } = arguments_;

    try {
      const { email, password } = data;

      //  check if the email is valid
      const emailResult = validateEmail(email, config);

      if (!emailResult.success && emailResult.message) {
        const mercuriusError = new mercurius.ErrorWithProps(
          emailResult.message
        );

        return mercuriusError;
      }

      // password strength validation
      const passwordStrength = validatePassword(password, config);

      if (!passwordStrength.success && passwordStrength.message) {
        const mercuriusError = new mercurius.ErrorWithProps(
          passwordStrength.message
        );

        return mercuriusError;
      }

      const service = new Service<
        Invitation & QueryResultRow,
        InvitationCreateInput,
        InvitationUpdateInput
      >(config, database, dbSchema);

      const invitation = await service.findByToken(token);

      // validate the invitation
      if (!invitation || !isInvitationValid(invitation)) {
        const mercuriusError = new mercurius.ErrorWithProps(
          "Invitation is invalid or has expired"
        );

        return mercuriusError;
      }

      // compare the FieldInput email to the invitation email
      if (invitation.email != email) {
        const mercuriusError = new mercurius.ErrorWithProps(
          "Email do not match with the invitation"
        );

        return mercuriusError;
      }

      // signup
      const signUpResponse = await emailPasswordSignUp(email, password, {
        roles: [invitation.role],
        autoVerifyEmail: true,
        tenant: reply.request.tenant,
      });

      if (signUpResponse.status !== "OK") {
        return signUpResponse;
      }

      // update invitation's acceptedAt value with current time
      await service.update(invitation.id, {
        acceptedAt: formatDate(new Date(Date.now())),
      });

      // run post accept hook
      try {
        await config.user.invitation?.postAccept?.(
          reply.request,
          invitation,
          signUpResponse.user as unknown as User
        );
      } catch (error) {
        app.log.error(error);
      }

      // create new session so the user be logged in on signup
      await createNewSession(reply.request, reply, signUpResponse.user.id);

      return {
        ...signUpResponse,
        user: {
          ...signUpResponse.user,
          roles: [invitation.role],
        },
      };
    } catch (error) {
      app.log.error(error);

      const mercuriusError = new mercurius.ErrorWithProps(
        "Oops! Something went wrong"
      );

      mercuriusError.statusCode = 500;

      return mercuriusError;
    }
  },
};

export default { Mutation };
