import getMultiTenantConfig from "./getMultiTenantConfig";

import type { ApiConfig } from "@dzangolab/fastify-config";
import type { PrimitiveValueExpression } from "slonik";

const slugValidator = (
  config: ApiConfig,
  tenant: Record<string, PrimitiveValueExpression>
) => {
  const slugColumn = getMultiTenantConfig(config).table.columns.slug;

  const slugValue = tenant[slugColumn] as string;

  const regex = /^(?!.*-+$)[A-Za-z][\dA-Za-z-]{0,61}([\dA-Za-z])?$/;

  if (!regex.test(slugValue)) {
    throw new Error(`'${slugValue}' is not valid ${slugColumn}`);
  }
};

export default slugValidator;
