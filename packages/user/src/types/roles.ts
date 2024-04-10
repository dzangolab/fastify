import { z } from "zod";

import { roleSchema } from "../schemas";

type Role = z.infer<typeof roleSchema>;

type RoleCreateInput = Omit<Role, "id">;

type RoleUpdateInput = Partial<Omit<Role, "id" | "role">>;

export type { Role, RoleCreateInput, RoleUpdateInput };
