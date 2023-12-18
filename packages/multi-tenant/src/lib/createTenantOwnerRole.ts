import UserRoles from "supertokens-node/recipe/userroles";

const createTenantOwnerRole = async () => {
  await UserRoles.createNewRoleOrAddPermissions("TENANT_OWNER", []);
};

export default createTenantOwnerRole;
