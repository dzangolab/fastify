import { UserService } from "@dzangolab/fastify-user";

import getMultiTenantConfig from "./getMultiTenantConfig";

import type { Tenant } from "../types/tenant";
import type { ApiConfig } from "@dzangolab/fastify-config";
import type { Database } from "@dzangolab/fastify-slonik";
import type {
  User,
  UserCreateInput,
  UserUpdateInput,
} from "@dzangolab/fastify-user";
import type { QueryResultRow } from "slonik";

const getUserService = (
  config: ApiConfig,
  slonik: Database,
  tenant?: Tenant
) => {
  const multiTenantConfig = getMultiTenantConfig(config);

  const schema = tenant ? tenant[multiTenantConfig.table.columns.slug] : "";

  return new UserService<
    User & QueryResultRow,
    UserCreateInput,
    UserUpdateInput
  >(config, slonik, schema);
};

export default getUserService;
