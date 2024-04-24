import type { FastifyInstance } from "fastify";
import type { RecipeInterface } from "supertokens-node/recipe/session/types";

const getSession = (
  originalImplementation: RecipeInterface,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fastify: FastifyInstance
): RecipeInterface["getSession"] => {
  return async (input) => {
    if (originalImplementation.createNewSession === undefined) {
      throw new Error("Should never come here");
    }

    input.options = {
      checkDatabase:
        fastify.config.user.supertokens.checkSessionInDatabase || true,
      ...input.options,
    };

    const originalResponse = await originalImplementation.getSession(input);

    return originalResponse;
  };
};

export default getSession;
