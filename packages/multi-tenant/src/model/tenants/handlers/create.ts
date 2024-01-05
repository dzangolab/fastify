import { validateTenantInput } from "../../../lib/validateTenantSchema";
import Service from "../service";

import type { TenantCreateInput } from "../../../types";
import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const create = async (request: SessionRequest, reply: FastifyReply) => {
  const userId = request.session?.getUserId();

  if (userId) {
    const input = request.body as TenantCreateInput;

    input.ownerId = userId;

    validateTenantInput(request.config, input);

    const service = new Service(request.config, request.slonik);

    const data = await service.create(input);

    reply.send(data);
  } else {
    request.log.error("could not get user id from session");
    throw new Error("Oops, Something went wrong");
  }
};

export default create;
