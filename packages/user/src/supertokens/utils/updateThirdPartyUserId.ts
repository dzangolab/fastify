import type { Tenant } from "@dzangolab/fastify-multi-tenant";

const updateThirdPartyUserId = {
  appendTenantId: (userid: string, tenant: Tenant) => {
    return tenant.id + "_" + userid;
  },
};

export default updateThirdPartyUserId;
