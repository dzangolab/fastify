import RoleService from "../../model/roles/service";

import type { Role, RoleCreateInput, RoleUpdateInput } from "../../types";
import type { ApiConfig } from "@dzangolab/fastify-config";
import type { Database, FilterInput } from "@dzangolab/fastify-slonik";

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

  const filterInput: FilterInput = {
    key: "role",
    operator: "eq",
    value: role,
  };

  const { filteredCount } = await service.list(
    undefined,
    undefined,
    filterInput
  );

  return !!filteredCount;
};

export default isRoleExists;
