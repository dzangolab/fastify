import { z } from "zod";

const permissionSchema = z.object({
  id: z.number(),
  description: z.string().nullable(),
  name: z.string().max(255),
});

export default permissionSchema;
