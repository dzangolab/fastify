import { ROLE_TENANT_OWNER } from "../../../constants";
import getUserService from "../../../lib/getUserService";
import Service from "../service";

import type { User } from "@dzangolab/fastify-user";
import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const tenant = async (request: SessionRequest, reply: FastifyReply) => {
  if (request.tenant) {
    throw {
      name: "GET_TENANT_FAILED",
      message: "Tenant app cannot retrieve tenant information",
      statusCode: 403,
    };
  }

  const userId = request.session?.getUserId();

  if (!userId) {
    request.log.error("could not get user id from session");
    throw new Error("Oops, Something went wrong");
  }

  const service = new Service(request.config, request.slonik, request.dbSchema);

  const userService = getUserService(request.config, request.slonik);

  const user = (await userService.findById(userId)) as User;

  // [DU 2024-JAN-15] TODO: address the scenario in which a user possesses
  // both roles: ADMIN and TENANT_OWNER
  if (user.roles.some(({ role }) => role === ROLE_TENANT_OWNER)) {
    service.ownerId = userId;
  }

  const { id } = request.params as { id: number };

  const data = await service.findById(id);

  reply.send(data);
};

export default tenant;
