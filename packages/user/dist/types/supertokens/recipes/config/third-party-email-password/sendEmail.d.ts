import ThirdPartyEmailPassword from "supertokens-node/recipe/thirdpartyemailpassword";
import type { FastifyInstance } from "fastify";
declare const sendEmail: (fastify: FastifyInstance) => typeof ThirdPartyEmailPassword.sendEmail;
export default sendEmail;
//# sourceMappingURL=sendEmail.d.ts.map