import type { EmailVerificationRecipe } from "./emailVerificationRecipe";
import type { SessionRecipe } from "./sessionRecipe";
import type { ThirdPartyEmailPasswordRecipe } from "./thirdPartyEmailPasswordRecipe";
import type { FastifyInstance } from "fastify";
import type { TypeInput as EmailVerificationRecipeConfig } from "supertokens-node/recipe/emailverification/types";
import type { TypeInput as SessionRecipeConfig } from "supertokens-node/recipe/session/types";
import type { TypeProvider } from "supertokens-node/recipe/thirdpartyemailpassword";
import type { TypeInput as ThirdPartyEmailPasswordRecipeConfig } from "supertokens-node/recipe/thirdpartyemailpassword/types";
import type { TypeInput as UserRolesRecipeConfig } from "supertokens-node/recipe/userroles/types";
declare const Apple: typeof import("supertokens-node/lib/build/recipe/thirdparty/providers/apple").default, Facebook: typeof import("supertokens-node/lib/build/recipe/thirdparty/providers/facebook").default, Github: typeof import("supertokens-node/lib/build/recipe/thirdparty/providers/github").default, Google: typeof import("supertokens-node/lib/build/recipe/thirdparty/providers/google").default;
interface SupertokensRecipes {
    emailVerification?: EmailVerificationRecipe | ((fastify: FastifyInstance) => EmailVerificationRecipeConfig);
    session?: SessionRecipe | ((fastify: FastifyInstance) => SessionRecipeConfig);
    userRoles?: (fastify: FastifyInstance) => UserRolesRecipeConfig;
    thirdPartyEmailPassword?: ThirdPartyEmailPasswordRecipe | ((fastify: FastifyInstance) => ThirdPartyEmailPasswordRecipeConfig);
}
interface SupertokensThirdPartyProvider {
    apple?: Parameters<typeof Apple>[0][];
    facebook?: Parameters<typeof Facebook>[0];
    github?: Parameters<typeof Github>[0];
    google?: Parameters<typeof Google>[0];
    custom?: TypeProvider[];
}
interface SupertokensConfig {
    /**
     * @default true
     */
    checkSessionInDatabase?: boolean;
    connectionUri: string;
    providers?: SupertokensThirdPartyProvider;
    recipes?: SupertokensRecipes;
    refreshTokenCookiePath?: string;
    resetPasswordPath?: string;
    emailVerificationPath?: string;
    sendUserAlreadyExistsWarning?: boolean;
}
export type { SupertokensConfig, SupertokensRecipes };
//# sourceMappingURL=index.d.ts.map