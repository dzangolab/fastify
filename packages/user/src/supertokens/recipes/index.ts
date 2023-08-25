import initEmailVerificationRecipe from "./initEmailVerificationRecipe";
import initSessionRecipe from "./initSessionRecipe";
import initThirdPartyEmailPassword from "./initThirdPartyEmailPasswordRecipe";
import initUserRolesRecipe from "./initUserRolesRecipe";

import type { FastifyInstance } from "fastify";
import type { RecipeListFunction } from "supertokens-node/types";

const getRecipeList = (fastify: FastifyInstance): RecipeListFunction[] => {
  const recipeList = [
    initEmailVerificationRecipe(fastify),
    // EmailVerification.init({
    //   mode: "REQUIRED",
    //   emailDelivery: {
    //     override: (originalImplementation) => {
    //       return {
    //         ...originalImplementation,
    //         sendEmail(input) {
    //           const passwordResetLink = input.emailVerifyLink;

    //           sendEmail({
    //             fastify,
    //             subject: "Email Verification",
    //             templateName: "reset-password",
    //             to: input.user.email,
    //             templateData: {
    //               passwordResetLink,
    //             },
    //           });
    //           return originalImplementation.sendEmail({ ...input });
    //         },
    //       };
    //     },
    //   },
    // }),
    initSessionRecipe(fastify),
    initThirdPartyEmailPassword(fastify),
    initUserRolesRecipe(fastify),
  ];

  return recipeList;
};

export default getRecipeList;
