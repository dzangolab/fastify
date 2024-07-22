import Service from "../service";

import type { OrganizationUpdateInput } from "../../../types";
import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const updateOrganization = async (
  request: SessionRequest,
  reply: FastifyReply
) => {
  const service = new Service(request.config, request.slonik);

  const { id } = request.params as { id: number };

  const input = request.body as OrganizationUpdateInput;

  const data = await service.update(id, input);

  reply.send(data);
};

export default updateOrganization;
