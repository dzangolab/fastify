import getMultiTenantConfig from "../../../lib/getMultiTenantConfig";
import { validateTenantInput } from "../../../lib/validateTenantSchema";
import Service from "../service";

import type { TenantCreateInput } from "../../../types";
import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const create = async (request: SessionRequest, reply: FastifyReply) => {
  if (request.tenant) {
    throw {
      name: "CREATE_TENANT_FAILED",
      message: "Tenant app cannot be used to create tenant",
      statusCode: 403,
    };
  }

  const userId = request.session?.getUserId();

  if (userId) {
    const input = request.body as TenantCreateInput;

    validateTenantInput(request.config, input);

    const multiTenantConfig = getMultiTenantConfig(request.config);

    input[multiTenantConfig.table.columns.ownerId] = userId;

    const service = new Service(request.config, request.slonik);

    const data = await service.create(input);

    reply.send(data);
  } else {
    request.log.error("could not get user id from session");
    throw new Error("Oops, Something went wrong");
  }
};

export default create;
