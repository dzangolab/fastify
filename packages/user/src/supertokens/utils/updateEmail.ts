import "@dzangolab/fastify-multi-tenant";

import { APIOptions } from "supertokens-node/recipe/emailpassword";

interface FormField {
  id: string;
  value: string;
}

const addTenantId = async (options: APIOptions, formFields: FormField[]) => {
  const tenant = options.req.original.tenant;

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
