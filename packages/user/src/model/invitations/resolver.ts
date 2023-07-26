import mercurius from "mercurius";

import Service from "./service";
import getInvitationLink from "./utils/getInvitationLink";
import isInvitationValid from "./utils/isInvitationValid";
import formatDate from "../../lib/formatDate";
import sendEmail from "../../lib/sendEmail";
import getOrigin from "../../supertokens/utils/getOrigin";

import type {
  Invitation,
  InvitationCreateInput,
  InvitationUpdateInput,
} from "../../types/invitation";
import type { FilterInput, SortInput } from "@dzangolab/fastify-slonik";
import type { MercuriusContext } from "mercurius";
import type { QueryResultRow } from "slonik";

const Mutation = {
  resendInvitation: async (
    parent: unknown,
    arguments_: {
      id: number;
    },
    context: MercuriusContext
  ) => {
    const { app, config, database, dbSchema, reply } = context;

    const service = new Service<
      Invitation & QueryResultRow,
      InvitationCreateInput,
      InvitationUpdateInput
    >(config, database, dbSchema);

    const invitation = await service.findById(arguments_.id);

    // is invitation valid
    if (!invitation || !isInvitationValid(invitation)) {
      const mercuriusError = new mercurius.ErrorWithProps(
        "Invitation is invalid or has expired"
      );

      return mercuriusError;
    }

    // send invitation
    const { headers, hostname, mailer } = reply.request;
    const url = headers.referer || headers.origin || hostname;

    const origin = getOrigin(url) || config.appOrigin[0];
    try {
      sendEmail({
        config,
        mailer,
        log: app.log,
        subject: "Invitation for Sign Up",
        templateData: {
          invitationLink: getInvitationLink(config, invitation.token, origin),
        },
        templateName: "user-invitation",
        to: invitation.email,
      });
    } catch (error) {
      app.log.error(error);
    }

    return invitation;
  },
  revokeInvitation: async (
    parent: unknown,
    arguments_: {
      id: number;
    },
    context: MercuriusContext
  ) => {
    const service = new Service<
      Invitation & QueryResultRow,
      InvitationCreateInput,
      InvitationUpdateInput
    >(context.config, context.database, context.dbSchema);

    let invitation = await service.findById(arguments_.id);

    let errorMessage: string | undefined;

    if (!invitation) {
      errorMessage = "Invitation not found";
    } else if (invitation.acceptedAt) {
      errorMessage = "Invitation is already accepted";
    } else if (Date.now() > invitation.expiresAt) {
      errorMessage = "Invitation is expired";
    } else if (invitation.revokedAt) {
      errorMessage = "Invitation is already revoked";
    }

    if (errorMessage) {
      const mercuriusError = new mercurius.ErrorWithProps(errorMessage);

      return mercuriusError;
    }

    invitation = await service.update(arguments_.id, {
      revokedAt: formatDate(new Date(Date.now())),
    });

    return invitation;
  },
};

const Query = {
  getInvitationByToken: async (
    parent: unknown,
    arguments_: {
      token: string;
    },
    context: MercuriusContext
  ) => {
    try {
      const service = new Service<
        Invitation & QueryResultRow,
        InvitationCreateInput,
        InvitationUpdateInput
      >(context.config, context.database, context.dbSchema);

      const invitation = await service.findByToken(arguments_.token);

      return invitation;
    } catch (error) {
      context.app.log.error(error);

      const mercuriusError = new mercurius.ErrorWithProps(
        "Oops, Something went wrong"
      );
      mercuriusError.statusCode = 500;

      return mercuriusError;
    }
  },
  invitations: async (
    parent: unknown,
    arguments_: {
      limit: number;
      offset: number;
      filters?: FilterInput;
      sort?: SortInput[];
    },
    context: MercuriusContext
  ) => {
    const service = new Service(
      context.config,
      context.database,
      context.dbSchema
    );

    return await service.list(
      arguments_.limit,
      arguments_.offset,
      arguments_.filters
        ? JSON.parse(JSON.stringify(arguments_.filters))
        : undefined,
      arguments_.sort ? JSON.parse(JSON.stringify(arguments_.sort)) : undefined
    );
  },
};

export default { Mutation, Query };
