import ThirdPartyEmailPassword from "supertokens-node/recipe/thirdpartyemailpassword";
import sendEmail from "../../../../lib/sendEmail";
import type { FastifyInstance } from "fastify";
import type { EmailDeliveryInterface } from "supertokens-node/lib/build/ingredients/emaildelivery/types";
import type { TypeEmailPasswordPasswordResetEmailDeliveryInput } from "supertokens-node/lib/build/recipe/emailpassword/types";
declare const sendPasswordResetEmail: (originalImplementation: EmailDeliveryInterface<TypeEmailPasswordPasswordResetEmailDeliveryInput>, fastify: FastifyInstance) => typeof ThirdPartyEmailPassword.sendEmail;
export default sendPasswordResetEmail;
//# sourceMappingURL=sendPasswordResetEmail.d.ts.map