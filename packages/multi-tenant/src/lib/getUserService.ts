import { getUserService as getBaseUserService } from "@dzangolab/fastify-user";

import getMultiTenantConfig from "./getMultiTenantConfig";

import type { Tenant } from "../types/tenant";
import type { ApiConfig } from "@dzangolab/fastify-config";
import type { Database } from "@dzangolab/fastify-slonik";

const getUserService = (
  config: ApiConfig,
  slonik: Database,
  tenant?: Tenant | string,
) => {
  const multiTenantConfig = getMultiTenantConfig(config);

  let dbSchema = "";

  if (tenant) {
    dbSchema =
      typeof tenant === "string"
        ? tenant
        : tenant[multiTenantConfig.table.columns.slug];
  }

  return getBaseUserService(config, slonik, dbSchema);
};

export default getUserService;
