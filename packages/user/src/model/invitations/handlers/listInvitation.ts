import Service from "../service";

import type {
  Invitation,
  InvitationCreateInput,
  InvitationUpdateInput,
} from "../../../types/invitation";
import type { FastifyReply } from "fastify";
import type { QueryResultRow } from "slonik";
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

    const service = new Service<
      Invitation & QueryResultRow,
      InvitationCreateInput,
      InvitationUpdateInput
    >(config, slonik, dbSchema);

    const invitations = await service.list(
      limit,
      offset,
      filters ? JSON.parse(filters) : undefined,
      sort ? JSON.parse(sort) : undefined
    );

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
