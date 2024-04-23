import RoleService from "../../model/roles/service";

import type { Role, RoleCreateInput, RoleUpdateInput } from "../../types";
import type { ApiConfig } from "@dzangolab/fastify-config";
import type { Database } from "@dzangolab/fastify-slonik";

const isRoleExists = async (
  role: string,
  config: ApiConfig,
  slonik: Database,
  dbSchema?: string
): Promise<boolean> => {
  const service = new RoleService<Role, RoleCreateInput, RoleUpdateInput>(
    config,
    slonik,
    dbSchema
  );

  const count = await service.count({
    key: "role",
    operator: "eq",
    value: role,
  });

  return !!count;
};

export default isRoleExists;
