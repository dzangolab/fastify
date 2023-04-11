import getTenantMappedId from "./getTenantMappedId";

import type { Tenant } from "./../../../types";
import type { ApiConfig } from "@dzangolab/fastify-config";

interface FormField {
  id: string;
  value: string;
}

const updateFields = (
  config: ApiConfig,
  formFields: FormField[],
  tenant: Tenant | undefined
) => {
  if (tenant) {
    formFields.find((field) => {
      if (field.id === "email") {
        field.value = tenant[getTenantMappedId(config)] + "_" + field.value;
      }
    });
  }

  return formFields;
};

export default updateFields;
