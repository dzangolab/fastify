import RoleService from "../../model/roles/service";

import type { Role, RoleCreateInput, RoleUpdateInput } from "../../types";
import type { ApiConfig } from "@dzangolab/fastify-config";
import type { Database, FilterInput } from "@dzangolab/fastify-slonik";

const areRolesExist = async (
  roles: string[],
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
    operator: "in",
    value: roles.join(","),
  });

  return !!count;
};

export default areRolesExist;
