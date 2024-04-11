import RoleService from "../model/roles/service";

import type { Role, RoleCreateInput, RoleUpdateInput } from "../types";
import type { ApiConfig } from "@dzangolab/fastify-config";
import type { Database, FilterInput } from "@dzangolab/fastify-slonik";

const getRolesByNames = async (
  roles: string[],
  config: ApiConfig,
  slonik: Database,
  schema?: string
): Promise<readonly Role[]> => {
  const service = new RoleService<Role, RoleCreateInput, RoleUpdateInput>(
    config,
    slonik,
    schema
  );

  const filterInput: FilterInput = {
    OR: roles.map((role) => ({
      key: "role",
      operator: "eq",
      value: role,
    })),
  };

  // TODO: user all method instead of list
  const { data } = await service.list(undefined, undefined, filterInput);

  return data;
};

export default getRolesByNames;
