import type { FastifyInstance } from "fastify";
import type { RecipeInterface } from "supertokens-node/recipe/session/types";
declare const createNewSession: (originalImplementation: RecipeInterface, fastify: FastifyInstance) => RecipeInterface["createNewSession"];
export default createNewSession;
//# sourceMappingURL=createNewSession.d.ts.map