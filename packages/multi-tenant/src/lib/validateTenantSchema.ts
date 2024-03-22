import { z } from "zod";

import getMultiTenantConfig from "./getMultiTenantConfig";

import type { ApiConfig } from "@dzangolab/fastify-config";
import type { PrimitiveValueExpression } from "slonik";

const domainSchema = z.optional(
  z
    .string()
    .max(255)
    .regex(/^([\da-z]([\da-z-]{0,61}[\da-z])?\.)+[a-z]{2,}$/)
);

const slugSchema = z.string().regex(/^(?!.*-+$)[a-z][\da-z-]{0,61}([\da-z])?$/);

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

  const validationResult = tenantInputSchema.safeParse(mappedTenantInput);

  if (!validationResult.success) {
    if (
      validationResult.error.issues.some((issue) => {
        return issue.path.includes("slug");
      })
    ) {
      throw {
        name: "ERROR_INVALID_SLUG",
        message: "Invalid slug",
        statusCode: 422,
      };
    }

    throw {
      name: "ERROR_INVALID_DOMAIN",
      message: "Invalid domain",
      statusCode: 422,
    };
  }
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

  const validationResult = tenantInputSchema.safeParse(mappedTenantUpdate);

  if (!validationResult.success) {
    throw {
      name: "ERROR_INVALID_DOMAIN",
      message: "Invalid domain",
      statusCode: 422,
    };
  }
};

export { domainSchema, slugSchema, validateTenantInput, validateTenantUpdate };
