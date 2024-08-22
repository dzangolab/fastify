import { z } from "zod";

import { roleSchema } from "../schemas";

type Role = z.infer<typeof roleSchema>;

type RoleCreateInput = Omit<Role, "id">;

type RoleUpdateInput = Partial<Omit<Role, "id" | "key">>;

export type { Role, RoleCreateInput, RoleUpdateInput };
