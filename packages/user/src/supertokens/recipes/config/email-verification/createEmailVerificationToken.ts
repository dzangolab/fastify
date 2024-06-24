import supertokens from "supertokens-node";

import type { FastifyInstance, FastifyError } from "fastify";
import type { RecipeInterface } from "supertokens-node/recipe/emailverification";

const createEmailVerificationToken = (
  originalImplementation: RecipeInterface,
  fastify: FastifyInstance
): RecipeInterface["createEmailVerificationToken"] => {
  return async (input) => {
    const originalResponse =
      await originalImplementation.createEmailVerificationToken(input);

    // if (originalResponse.status === "OK") {
    //   await supertokens.createUserIdMapping({
    //     superTokensUserId: input.userId,
    //     externalUserId: originalResponse.token,
    //     externalUserIdInfo: "emailVerificationTokenMapping",
    //   });
    // }

    return originalResponse;
  };
};

export default createEmailVerificationToken;
