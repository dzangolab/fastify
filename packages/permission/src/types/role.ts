import { z } from "zod";

import { roleSchema } from "../schemas";

type Role = z.infer<typeof roleSchema>;

type RoleCreateInput = Omit<Role, "id" | "permissions"> & {
  permissionIds?: number[];
};

type RoleUpdateInput = Omit<Role, "id" | "key" | "permissions"> & {
  permissionIds?: number[];
};

export type { Role, RoleCreateInput, RoleUpdateInput };
