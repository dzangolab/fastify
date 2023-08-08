import UserRoles from "supertokens-node/recipe/userroles";

const areAllRolesExist = async (input: string[]): Promise<boolean> => {
  const { roles } = await UserRoles.getAllRoles();

  if (roles.length > 0 && input.length === 0) {
    return false;
  }

  return input.every((role) => roles.includes(role));
};

export default areAllRolesExist;
