import getIdIdentifier from "./getIdIdentifier";

import type { ApiConfig } from "@dzangolab/fastify-config";
import type { Tenant } from "@dzangolab/fastify-multi-tenant";

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
        field.value = tenant[getIdIdentifier(config)] + "_" + field.value;
      }
    });
  }

  return formFields;
};

export default updateFields;
