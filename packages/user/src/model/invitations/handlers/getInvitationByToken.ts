import Service from "../service";

import type {
  Invitation,
  InvitationCreateInput,
  InvitationUpdateInput,
} from "../../../types/invitation";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { QueryResultRow } from "slonik";

const getInvitationByToken = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { config, dbSchema, log, params, slonik } = request;

  const { token } = params as { token: string };

  try {
    const service = new Service<
      Invitation & QueryResultRow,
      InvitationCreateInput,
      InvitationUpdateInput
    >(config, slonik, dbSchema);

    const invitation = await service.findByToken(token);

    reply.send(invitation);
  } catch (error) {
    log.error(error);
    reply.status(500);

    reply.send({
      status: "ERROR",
      message: "Oops! Something went wrong",
    });
  }
};

export default getInvitationByToken;
