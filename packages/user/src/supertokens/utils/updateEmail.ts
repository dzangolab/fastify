import type { Tenant } from "@dzangolab/fastify-multi-tenant";

const updateEmail = {
  appendTenantId: (email: string, tenant: Tenant | undefined) => {
    if (tenant?.id) {
      email = tenant.id + "_" + email;
    }

    return email;
  },
  removeTenantId: (email: string, tenant: Tenant | undefined) => {
    if (tenant) {
      email = email.slice(Math.max(0, email.indexOf("_") + 1));
    }

    return email;
  },
};

export default updateEmail;
