import { z } from "zod";

import getMultiTenantConfig from "./getMultiTenantConfig";

import type { ApiConfig } from "@dzangolab/fastify-config";
import type { PrimitiveValueExpression } from "slonik";

const validateTenantInput = (
  config: ApiConfig,
  tenantInput: Record<string, PrimitiveValueExpression>
) => {
  const tenantTableColumnConfig = getMultiTenantConfig(config).table.columns;

  const mappedInputTenant = {
    slug: tenantInput[tenantTableColumnConfig.slug],
    domain: tenantInput[tenantTableColumnConfig.domain],
  };

  const tenantInputSchema = z.object({
    slug: z.string().regex(/^(?!.*-+$)[A-Za-z][\dA-Za-z-]{0,61}([\dA-Za-z])?$/),
    domain: z
      .string()
      .regex(/^([\dA-Za-z]([\dA-Za-z-]{0,61}[\dA-Za-z])?\.)+[A-Za-z]{2,}$/)
      .optional(),
  });

  tenantInputSchema.parse(mappedInputTenant);
};

export default validateTenantInput;
