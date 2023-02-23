import "@dzangolab/fastify-multi-tenant";

import type { Tenant } from "@dzangolab/fastify-multi-tenant";

interface FormField {
  id: string;
  value: string;
}

const addTenantId = async (formFields: FormField[], tenant: Tenant) => {
  if (tenant?.id) {
    formFields.find((field) => {
      if (field.id === "email") {
        field.value = tenant.id + "_" + field.value;
      }
    });
  }

  return formFields;
};

const removeTenantId = (email: string) => {
  return email.slice(Math.max(0, email.indexOf("_") + 1));
};

export { addTenantId, removeTenantId };
