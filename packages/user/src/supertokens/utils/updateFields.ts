import type { Tenant } from "@dzangolab/fastify-multi-tenant";

interface FormField {
  id: string;
  value: string;
}

const updateFields = (formFields: FormField[], tenant: Tenant | undefined) => {
  if (tenant?.id) {
    formFields.find((field) => {
      if (field.id === "email") {
        field.value = tenant.id + "_" + field.value;
      }
    });
  }

  return formFields;
};

export default updateFields;
