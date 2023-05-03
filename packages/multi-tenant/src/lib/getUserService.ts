import { Database } from "@dzangolab/fastify-slonik";
import {
  User,
  UserCreateInput,
  UserService,
  UserUpdateInput,
} from "@dzangolab/fastify-user";
import { QueryResultRow } from "slonik";

import getMultiTenantConfig from "./getMultiTenantConfig";
import { Tenant } from "../types/tenant";

import type { ApiConfig } from "@dzangolab/fastify-config";

const getUserService = (
  config: ApiConfig,
  slonik: Database,
  tenant?: Tenant
) => {
  const multiTenantConfig = getMultiTenantConfig(config);

  const dbSchema = tenant ? tenant[multiTenantConfig.table.columns.slug] : "";

  return new UserService<
    User & QueryResultRow,
    UserCreateInput,
    UserUpdateInput
  >(config, slonik, dbSchema);
};

export default getUserService;
