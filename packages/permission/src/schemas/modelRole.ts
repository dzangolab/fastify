import { z } from "zod";

const modelRoleSchema = z.object({
  id: z.number(),
  modelId: z.string(),
  modelName: z.string().max(255),
  roleId: z.string(),
});

export default modelRoleSchema;
