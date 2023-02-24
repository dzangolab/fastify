import "@dzangolab/fastify-multi-tenant";

import type { Tenant } from "@dzangolab/fastify-multi-tenant";

interface FormField {
  id: string;
  value: string;
}

const updateEmail = {
  appendTenantId: (formFields: FormField[], tenant: Tenant | undefined) => {
    if (tenant?.id) {
      formFields.find((field) => {
        if (field.id === "email") {
          field.value = tenant.id + "_" + field.value;
        }
      });
    }

    return formFields;
  },
  removeTenantId: (email: string, tenant: Tenant | undefined) => {
    if (tenant) {
      return email.slice(Math.max(0, email.indexOf("_") + 1));
    }

    return email;
  },
};

export default updateEmail;
