import "@dzangolab/fastify-multi-tenant";

import { APIOptions } from "supertokens-node/recipe/emailpassword";

const updateEmail = async (options: APIOptions, formFields: FormField[]) => {
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

interface FormField {
  id: string;
  value: string;
}

export default updateEmail;
