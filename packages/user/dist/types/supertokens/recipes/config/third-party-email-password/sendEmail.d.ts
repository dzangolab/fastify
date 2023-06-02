import ThirdPartyEmailPassword from "supertokens-node/recipe/thirdpartyemailpassword";
import type { FastifyInstance } from "fastify";
import type { EmailDeliveryInterface } from "supertokens-node/lib/build/ingredients/emaildelivery/types";
import type { TypeEmailPasswordPasswordResetEmailDeliveryInput } from "supertokens-node/lib/build/recipe/emailpassword/types";
declare const sendEmail: (originalImplementation: EmailDeliveryInterface<TypeEmailPasswordPasswordResetEmailDeliveryInput>, fastify: FastifyInstance) => typeof ThirdPartyEmailPassword.sendEmail;
export default sendEmail;
//# sourceMappingURL=sendEmail.d.ts.map