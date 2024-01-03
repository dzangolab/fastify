import { z } from "zod";

import getMultiTenantConfig from "./getMultiTenantConfig";

import type { ApiConfig } from "@dzangolab/fastify-config";
import type { PrimitiveValueExpression } from "slonik";

const domainSchema = z
  .string()
  .length(255)
  .regex(/^([\dA-Za-z]([\dA-Za-z-]{0,61}[\dA-Za-z])?\.)+[A-Za-z]{2,}$/)
  .optional();

const slugSchema = z
  .string()
  .regex(/^(?!.*-+$)[A-Za-z][\dA-Za-z-]{0,61}([\dA-Za-z])?$/);

const validateTenantInput = (
  config: ApiConfig,
  tenantInput: Record<string, PrimitiveValueExpression>
) => {
  const tenantTableColumnConfig = getMultiTenantConfig(config).table.columns;

  const mappedTenantInput = {
    slug: tenantInput[tenantTableColumnConfig.slug],
    domain: tenantInput[tenantTableColumnConfig.domain],
  };

  const tenantInputSchema = z.object({
    slug: slugSchema,
    domain: domainSchema,
  });

  tenantInputSchema.parse(mappedTenantInput);
};

const validateTenantUpdate = (
  config: ApiConfig,
  tenantUpdate: Record<string, PrimitiveValueExpression>
) => {
  const tenantTableColumnConfig = getMultiTenantConfig(config).table.columns;

  const mappedTenantUpdate = {
    domain: tenantUpdate[tenantTableColumnConfig.domain],
  };

  const tenantInputSchema = z.object({
    domain: domainSchema,
  });

  tenantInputSchema.parse(mappedTenantUpdate);
};

export { domainSchema, slugSchema, validateTenantInput, validateTenantUpdate };
