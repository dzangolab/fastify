import getAllReservedDomains from "../../../lib/getAllReservedDomains";
import getAllReservedSlugs from "../../../lib/getAllReservedSlugs";
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

    if (
      getAllReservedSlugs(request.config).includes(
        input[multiTenantConfig.table.columns.slug]
      )
    ) {
      throw {
        name: "CREATE_TENANT_FAILED",
        message: `The requested ${multiTenantConfig.table.columns.slug} "${
          input[multiTenantConfig.table.columns.slug]
        }" is reserved and cannot be used`,
        statusCode: 422,
      };
    }

    if (
      getAllReservedDomains(request.config).includes(
        input[multiTenantConfig.table.columns.domain]
      )
    ) {
      throw {
        name: "CREATE_TENANT_FAILED",
        message: `The requested ${multiTenantConfig.table.columns.domain} "${
          input[multiTenantConfig.table.columns.domain]
        }" is reserved and cannot be used`,
        statusCode: 422,
      };
    }

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
