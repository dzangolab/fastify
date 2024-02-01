import mercurius from "mercurius";
import UserRoles from "supertokens-node/recipe/userroles";

import Service from "./service";
import { ROLE_TENANT_OWNER } from "../../constants";
import getAllReservedDomains from "../../lib/getAllReservedDomains";
import getAllReservedSlugs from "../../lib/getAllReservedSlugs";
import getMultiTenantConfig from "../../lib/getMultiTenantConfig";
import { validateTenantInput } from "../../lib/validateTenantSchema";

import type { TenantCreateInput } from "./../../types";
import type { FilterInput, SortInput } from "@dzangolab/fastify-slonik";
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
    context: MercuriusContext
  ) => {
    if (context.tenant) {
      return new mercurius.ErrorWithProps(
        "Tenant app cannot be used to create tenant",
        undefined,
        403
      );
    }

    const userId = context.user?.id;

    if (userId) {
      const input = arguments_.data as TenantCreateInput;

      validateTenantInput(context.config, input);

      const multiTenantConfig = getMultiTenantConfig(context.config);

      input[multiTenantConfig.table.columns.ownerId] = userId;

      if (
        getAllReservedSlugs(context.config).includes(
          input[multiTenantConfig.table.columns.slug]
        )
      ) {
        return new mercurius.ErrorWithProps(
          `The requested ${multiTenantConfig.table.columns.slug} "${
            input[multiTenantConfig.table.columns.slug]
          }" is reserved and cannot be used`,
          undefined,
          422
        );
      }

      if (
        getAllReservedDomains(context.config).includes(
          input[multiTenantConfig.table.columns.domain]
        )
      ) {
        return new mercurius.ErrorWithProps(
          `The requested ${multiTenantConfig.table.columns.domain} "${
            input[multiTenantConfig.table.columns.domain]
          }" is reserved and cannot be used`,
          undefined,
          422
        );
      }

      const service = new Service(
        context.config,
        context.database,
        context.dbSchema
      );

      return await service.create(input);
    } else {
      context.app.log.error(
        "Could not able to get user id from mercurius context"
      );

      const mercuriusError = new mercurius.ErrorWithProps(
        "Oops, Something went wrong"
      );

      mercuriusError.statusCode = 500;

      return mercuriusError;
    }
  },
};

const Query = {
  allTenants: async (
    parent: unknown,
    arguments_: {
      fields: string[];
    },
    context: MercuriusContext
  ) => {
    if (context.tenant) {
      return new mercurius.ErrorWithProps(
        "Tenant app cannot display all tenants",
        undefined,
        403
      );
    }

    const userId = context.user?.id;

    if (!userId) {
      return new mercurius.ErrorWithProps(
        "Oops, Something went wrong",
        undefined,
        500
      );
    }

    const service = new Service(
      context.config,
      context.database,
      context.dbSchema
    );

    const { roles } = await UserRoles.getRolesForUser(userId);

    // [DU 2024-JAN-15] TODO: address the scenario in which a user possesses
    // both roles: ADMIN and TENANT_OWNER
    if (roles.includes(ROLE_TENANT_OWNER)) {
      service.ownerId = userId;
    }

    return await service.all(JSON.parse(JSON.stringify(arguments_.fields)));
  },
  tenant: async (
    parent: unknown,
    arguments_: { id: number },
    context: MercuriusContext
  ) => {
    if (context.tenant) {
      return new mercurius.ErrorWithProps(
        "Tenant app cannot retrieve tenant information",
        undefined,
        403
      );
    }

    const userId = context.user?.id;

    if (!userId) {
      return new mercurius.ErrorWithProps(
        "Oops, Something went wrong",
        undefined,
        500
      );
    }

    const service = new Service(
      context.config,
      context.database,
      context.dbSchema
    );

    const { roles } = await UserRoles.getRolesForUser(userId);

    // [DU 2024-JAN-15] TODO: address the scenario in which a user possesses
    // both roles: ADMIN and TENANT_OWNER
    if (roles.includes(ROLE_TENANT_OWNER)) {
      service.ownerId = userId;
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
    context: MercuriusContext
  ) => {
    if (context.tenant) {
      return new mercurius.ErrorWithProps(
        "Tenant app cannot display a list of tenants",
        undefined,
        403
      );
    }

    const userId = context.user?.id;

    if (!userId) {
      return new mercurius.ErrorWithProps(
        "Oops, Something went wrong",
        undefined,
        500
      );
    }

    const service = new Service(
      context.config,
      context.database,
      context.dbSchema
    );

    const { roles } = await UserRoles.getRolesForUser(userId);

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
      arguments_.sort ? JSON.parse(JSON.stringify(arguments_.sort)) : undefined
    );
  },
};

export default { Mutation, Query };
