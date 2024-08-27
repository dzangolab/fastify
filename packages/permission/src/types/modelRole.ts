import { z } from "zod";

import { modelRoleSchema } from "../schemas";

type ModelRole = z.infer<typeof modelRoleSchema>;

type ModelRoleCreateInput = Omit<ModelRole, "id">;

type ModelRoleUpdateInput = Omit<ModelRole, "id">;

export type { ModelRole, ModelRoleCreateInput, ModelRoleUpdateInput };
