import { z } from "zod";
import type { ApiConfig } from "@dzangolab/fastify-config";
import type { PrimitiveValueExpression } from "slonik";
declare const domainSchema: z.ZodOptional<z.ZodString>;
declare const slugSchema: z.ZodString;
declare const validateTenantInput: (config: ApiConfig, tenantInput: Record<string, PrimitiveValueExpression>) => void;
declare const validateTenantUpdate: (config: ApiConfig, tenantUpdate: Record<string, PrimitiveValueExpression>) => void;
export { domainSchema, slugSchema, validateTenantInput, validateTenantUpdate };
//# sourceMappingURL=validateTenantSchema.d.ts.map