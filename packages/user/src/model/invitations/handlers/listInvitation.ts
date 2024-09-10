import getInvitationService from "../../../lib/getInvitationService";

import type { Invitation } from "../../../types/invitation";
import type { PaginatedList } from "@dzangolab/fastify-slonik";
import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const listInvitation = async (request: SessionRequest, reply: FastifyReply) => {
  const { config, dbSchema, log, query, slonik } = request;

  try {
    const { limit, offset, filters, sort } = query as {
      limit: number;
      offset?: number;
      filters?: string;
      sort?: string;
    };

    const service = getInvitationService(config, slonik, dbSchema);

    const invitations = (await service.list(
      limit,
      offset,
      filters ? JSON.parse(filters) : undefined,
      sort ? JSON.parse(sort) : undefined
    )) as PaginatedList<Partial<Invitation>>;

    for (const invitation of invitations.data) {
      delete invitation.token;
    }

    reply.send(invitations);
  } catch (error) {
    log.error(error);
    reply.status(500);

    reply.send({
      status: "ERROR",
      message: "Oops! Something went wrong",
    });
  }
};

export default listInvitation;
