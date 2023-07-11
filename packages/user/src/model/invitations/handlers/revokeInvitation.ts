import formatDate from "../../../supertokens/utils/formatDate";
import Service from "../service";

import type { Invitation } from "../../../types/invitation";
import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const revokeInvitation = async (
  request: SessionRequest,
  reply: FastifyReply
) => {
  const { config, dbSchema, log, params, slonik } = request;

  try {
    const { id } = params as { id: string };

    const service = new Service(config, slonik, dbSchema);

    const invitation = (await service.update(id, {
      revokedAt: formatDate(new Date(Date.now())),
    })) as unknown as Invitation | null;

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

export default revokeInvitation;
