import { z } from "zod";
import type { EmailErrorMessages, IsEmailOptions } from "../types";
declare const schema: (errorMessages: EmailErrorMessages, options: IsEmailOptions | undefined) => z.ZodEffects<z.ZodString, string, string>;
export default schema;
//# sourceMappingURL=email.d.ts.map