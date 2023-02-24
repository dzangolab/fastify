import updateEmail from "./updateEmail";

import type { User } from "../../types";
import type { Tenant } from "@dzangolab/fastify-multi-tenant";
import type { User as SupertokensUser } from "supertokens-node/recipe/thirdpartyemailpassword";

const updateTenantUser = (
  user: User | SupertokensUser,
  tenant: Tenant | undefined
): User | SupertokensUser => {
  return { ...user, email: updateEmail.removeTenantId(user.email, tenant) };
};

export default updateTenantUser;
