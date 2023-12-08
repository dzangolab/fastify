import { BaseService } from "@dzangolab/fastify-slonik";

import { TABLE_PERMISSIONS } from "../../constants";

import type { QueryResultRow } from "slonik";

class PermissionService<
  T extends QueryResultRow,
  C extends QueryResultRow,
  U extends QueryResultRow
> extends BaseService<T, C, U> {
  static readonly TABLE = TABLE_PERMISSIONS;

  isPermissionExists = async (id: string): Promise<boolean> => {
    const permission = await this.findById(id);

    return !!permission;
  };
}

export default PermissionService;
