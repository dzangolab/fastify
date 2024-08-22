import { z } from "zod";

import { permissionSchema } from "../schemas";

type Permission = z.infer<typeof permissionSchema>;

type PermissionCreateInput = Omit<Permission, "id">;

type PermissionUpdateInput = Partial<Omit<Permission, "id">>;

export type { Permission, PermissionCreateInput, PermissionUpdateInput };
