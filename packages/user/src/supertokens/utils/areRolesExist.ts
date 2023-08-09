import UserRoles from "supertokens-node/recipe/userroles";

const areRolesExist = async (roles: string[]): Promise<boolean> => {
  const { roles: allRoles } = await UserRoles.getAllRoles();

  return roles.every((role) => allRoles.includes(role));
};

export default areRolesExist;
