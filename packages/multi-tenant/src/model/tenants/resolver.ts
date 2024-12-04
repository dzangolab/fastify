import mercurius from "mercurius";
import UserRoles from "supertokens-node/recipe/userroles";

import Service from "./service";
import { ROLE_TENANT_OWNER } from "../../constants";
import getMultiTenantConfig from "../../lib/getMultiTenantConfig";

import type { TenantCreateInput } from "./../../types";
import type { FilterInput, SortInput } from "@dzangolab/fastify-slonik";
import type { FastifyError } from "fastify";
import type { MercuriusContext } from "mercurius";

const Mutation = {
  createTenant: async (
    parent: unknown,
    arguments_: {
      data: {
        id: string;
        password: string;
      };
    },
    context: MercuriusContext,
  ) => {
    const { config, database, dbSchema, tenant, user } = context;

    if (tenant) {
      return new mercurius.ErrorWithProps(
        "Tenant app cannot be used to create tenant",
        undefined,
        403,
      );
    }

    if (!user) {
      return new mercurius.ErrorWithProps("unauthorized", {}, 401);
    }

    const input = arguments_.data as TenantCreateInput;

    const multiTenantConfig = getMultiTenantConfig(context.config);

    input[multiTenantConfig.table.columns.ownerId] = user.id;

    const service = new Service(config, database, dbSchema);

    return await service.create(input).catch((error: FastifyError) => {
      return new mercurius.ErrorWithProps(
        error.message,
        undefined,
        error.statusCode,
      );
    });
  },
};

const Query = {
  allTenants: async (
    parent: unknown,
    arguments_: {
      fields: string[];
    },
    context: MercuriusContext,
  ) => {
    const { config, database, dbSchema, tenant, user } = context;

    if (tenant) {
      return new mercurius.ErrorWithProps(
        "Tenant app cannot display all tenants",
        undefined,
        403,
      );
    }

    if (!user) {
      return new mercurius.ErrorWithProps("unauthorized", {}, 401);
    }

    const service = new Service(config, database, dbSchema);

    const { roles } = await UserRoles.getRolesForUser(user.id);

    // [DU 2024-JAN-15] TODO: address the scenario in which a user possesses
    // both roles: ADMIN and TENANT_OWNER
    if (roles.includes(ROLE_TENANT_OWNER)) {
      service.ownerId = user.id;
    }

    return await service.all(JSON.parse(JSON.stringify(arguments_.fields)));
  },
  tenant: async (
    parent: unknown,
    arguments_: { id: number },
    context: MercuriusContext,
  ) => {
    const { config, database, dbSchema, tenant, user } = context;

    if (tenant) {
      return new mercurius.ErrorWithProps(
        "Tenant app cannot retrieve tenant information",
        undefined,
        403,
      );
    }

    if (!user) {
      return new mercurius.ErrorWithProps("unauthorized", {}, 401);
    }

    const service = new Service(config, database, dbSchema);

    const { roles } = await UserRoles.getRolesForUser(user.id);

    // [DU 2024-JAN-15] TODO: address the scenario in which a user possesses
    // both roles: ADMIN and TENANT_OWNER
    if (roles.includes(ROLE_TENANT_OWNER)) {
      service.ownerId = user.id;
    }

    return await service.findById(arguments_.id);
  },
  tenants: async (
    parent: unknown,
    arguments_: {
      limit: number;
      offset: number;
      filters?: FilterInput;
      sort?: SortInput[];
    },
    context: MercuriusContext,
  ) => {
    const { config, database, dbSchema, tenant, user } = context;

    if (tenant) {
      return new mercurius.ErrorWithProps(
        "Tenant app cannot display a list of tenants",
        undefined,
        403,
      );
    }

    const userId = context.user?.id;

    if (!user) {
      return new mercurius.ErrorWithProps("unauthorized", {}, 401);
    }

    const service = new Service(config, database, dbSchema);

    const { roles } = await UserRoles.getRolesForUser(user.id);

    // [DU 2024-JAN-15] TODO: address the scenario in which a user possesses
    // both roles: ADMIN and TENANT_OWNER
    if (roles.includes(ROLE_TENANT_OWNER)) {
      service.ownerId = userId;
    }

    return await service.list(
      arguments_.limit,
      arguments_.offset,
      arguments_.filters
        ? JSON.parse(JSON.stringify(arguments_.filters))
        : undefined,
      arguments_.sort ? JSON.parse(JSON.stringify(arguments_.sort)) : undefined,
    );
  },
};

export default { Mutation, Query };
