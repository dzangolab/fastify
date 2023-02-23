import "@dzangolab/fastify-multi-tenant";

import type { Tenant } from "@dzangolab/fastify-multi-tenant";
import type { FastifyInstance } from "fastify";

const updateEmail = async (
  fastify: FastifyInstance,
  origin: string,
  formFields: FormField[]
) => {
  const slug1 = origin.split(".")[0];
  const slug2 = slug1.split("//")[1];

  if (slug2 === "admin") {
    return formFields;
  }

  const tenant = fastify.tenant as Tenant;

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
