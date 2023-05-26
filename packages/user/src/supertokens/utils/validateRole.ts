import UserRoles from "supertokens-node/recipe/userroles";

import type { FastifyError, FastifyInstance } from "fastify";

const validateRole = async (
  fastify: FastifyInstance,
  role: string
): Promise<void> => {
  const { roles } = await UserRoles.getAllRoles();

  if (!roles.includes(role)) {
    fastify.log.error(`Role "${role}" does not exist`);

    throw {
      name: "SIGN_UP_FAILED",
      message: "Something went wrong",
      statusCode: 500,
    } as FastifyError;
  }
};

export default validateRole;
