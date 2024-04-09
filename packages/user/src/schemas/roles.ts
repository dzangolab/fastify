import { z } from "zod";

const roleSchema = z.object({
  id: z.number(),
  role: z.string().max(255),
  permissions: z.optional(z.array(z.string().max(255))),
  default: z.boolean(),
});

export default roleSchema;
