import { z } from "zod";

import permissionSchema from "./permission";

// const roleSchema = z.object({
//   id: z.number(),
//   role: z.string().max(255),
//   permissions: z.optional(z.array(permissionSchema)),
//   default: z.boolean(),
// });

const roleSchema = z.object({
  id: z.number(),
  key: z.string().max(255),
  name: z.string().max(255),
  permissions: z.optional(z.array(permissionSchema)),
  default: z.boolean(),
});

export default roleSchema;
