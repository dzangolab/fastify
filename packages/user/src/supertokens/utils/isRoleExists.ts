import UserRoles from "supertokens-node/recipe/userroles";

const isRoleExists = async (role: string): Promise<boolean> => {
  const { roles } = await UserRoles.getAllRoles();

  return roles.includes(role);
};

export default isRoleExists;
