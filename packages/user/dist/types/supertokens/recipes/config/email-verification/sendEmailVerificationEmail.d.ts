import emailVerification from "supertokens-node/recipe/emailverification";
import sendEmail from "../../../../lib/sendEmail";
import type { FastifyInstance } from "fastify";
import type { EmailDeliveryInterface } from "supertokens-node/lib/build/ingredients/emaildelivery/types";
import type { TypeEmailVerificationEmailDeliveryInput } from "supertokens-node/recipe/emailverification/types";
declare const sendEmailVerificationEmail: (originalImplementation: EmailDeliveryInterface<TypeEmailVerificationEmailDeliveryInput>, fastify: FastifyInstance) => typeof emailVerification.sendEmail;
export default sendEmailVerificationEmail;
//# sourceMappingURL=sendEmailVerificationEmail.d.ts.map