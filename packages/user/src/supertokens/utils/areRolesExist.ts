import UserRoles from "supertokens-node/recipe/userroles";

const areRolesExist = async (roles: string[]): Promise<boolean> => {
  const { roles: allRoles } = await UserRoles.getAllRoles();

  if (allRoles.length > 0 && roles.length === 0) {
    return false;
  }

  return roles.every((role) => allRoles.includes(role));
};

export default areRolesExist;
