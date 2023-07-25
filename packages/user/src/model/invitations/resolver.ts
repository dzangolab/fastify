import mercurius from "mercurius";

import Service from "./service";
import formatDate from "../../supertokens/utils/formatDate";

import type {
  Invitation,
  InvitationCreateInput,
  InvitationUpdateInput,
} from "../../types/invitation";
import type { FilterInput, SortInput } from "@dzangolab/fastify-slonik";
import type { MercuriusContext } from "mercurius";
import type { QueryResultRow } from "slonik";

const Mutation = {
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
      const mercuriusError = new mercurius.ErrorWithProps(
        "Oops, Something went wrong"
      );

      return mercuriusError;
    }

    invitation = await service.update(arguments_.id, {
      revokedAt: formatDate(new Date(Date.now())) as unknown as string,
    });

    const data: Partial<Invitation> = invitation;

    delete data.token;

    return data;
  },
};

const Query = {
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
