import { UserService } from "@dzangolab/fastify-user";
import humps from "humps";

import getMultiTenantConfig from "../../lib/getMultiTenantConfig";

import type { Tenant } from "../../types/tenant";
import type { ApiConfig } from "@dzangolab/fastify-config";
import type { Database } from "@dzangolab/fastify-slonik";
import type {
  User,
  UserCreateInput,
  UserUpdateInput,
} from "@dzangolab/fastify-user";
import type { QueryResultRow } from "slonik";

const isTenantOwnerEmail = async (
  config: ApiConfig,
  database: Database,
  email: string,
  tenant: Tenant
) => {
  const userService = new UserService<
    User & QueryResultRow,
    UserCreateInput,
    UserUpdateInput
  >(config, database);

  const multiTenantConfig = getMultiTenantConfig(config);

  const owner = await userService.findById(
    tenant[humps.camelize(multiTenantConfig.table.columns.ownerId)]
  );

  console.log("owner", owner);
  console.log("requestedEmail", email);

  if (owner) {
    return email === owner.email;
  }

  return false;
};

export default isTenantOwnerEmail;
