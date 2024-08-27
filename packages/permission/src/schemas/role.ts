import { z } from "zod";

import permissionSchema from "./permission";

const roleSchema = z.object({
  id: z.number(),
  key: z.string().max(255),
  name: z.string().max(255),
  permissions: z.optional(z.array(permissionSchema)),
  default: z.optional(z.boolean()),
  description: z.optional(z.string().nullable()),
});

export default roleSchema;
