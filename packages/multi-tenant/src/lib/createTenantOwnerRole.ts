import UserRoles from "supertokens-node/recipe/userroles";

import { ROLE_TENANT_OWNER } from "../constants";

const createTenantOwnerRole = async () => {
  await UserRoles.createNewRoleOrAddPermissions(ROLE_TENANT_OWNER, []);
};

export default createTenantOwnerRole;
