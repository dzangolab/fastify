import UserRoles from "supertokens-node/recipe/userroles";

import type { FastifyError } from "fastify";

const validateRole = async (role: string): Promise<void> => {
  const { roles } = await UserRoles.getAllRoles();

  if (!roles.includes(role)) {
    throw {
      name: "Invalid Role",
      message: `Role "${role}" does not exist`,
      statusCode: 404,
    } as FastifyError;
  }
};

export default validateRole;
