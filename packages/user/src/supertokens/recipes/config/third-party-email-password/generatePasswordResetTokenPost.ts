import updateEmail from "../../../utils/updateEmail";

import type { APIInterface } from "supertokens-node/recipe/thirdpartyemailpassword/types";

const generatePasswordResetTokenPOST = (
  originalImplementation: APIInterface
): typeof originalImplementation.generatePasswordResetTokenPOST => {
  return async (input) => {
    if (originalImplementation.generatePasswordResetTokenPOST === undefined) {
      throw new Error("Should never come here");
    }

    const formFields = await updateEmail.appendTenantId(
      input.formFields,
      input.options.req.original.tenant
    );

    input.formFields = formFields;

    const originalResponse =
      await originalImplementation.generatePasswordResetTokenPOST(input);

    return originalResponse;
  };
};

export default generatePasswordResetTokenPOST;
