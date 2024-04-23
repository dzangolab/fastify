import { RoleService } from "@dzangolab/fastify-user";

import { ROLE_TENANT_OWNER } from "../constants";

import type { ApiConfig } from "@dzangolab/fastify-config";
import type { Database } from "@dzangolab/fastify-slonik";
import type {
  Role,
  RoleCreateInput,
  RoleUpdateInput,
} from "@dzangolab/fastify-user";

const createTenantOwnerRole = async (config: ApiConfig, slonik: Database) => {
  const service = new RoleService<Role, RoleCreateInput, RoleUpdateInput>(
    config,
    slonik
  );

  const filteredCount = await service.count({
    key: "role",
    operator: "eq",
    value: ROLE_TENANT_OWNER,
  });

  if (!filteredCount) {
    await service.create({
      role: ROLE_TENANT_OWNER,
      permissions: [],
      default: false,
    });
  }
};

export default createTenantOwnerRole;
