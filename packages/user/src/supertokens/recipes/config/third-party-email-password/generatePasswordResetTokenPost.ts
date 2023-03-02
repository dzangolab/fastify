import updateFields from "../../../utils/updateFields";

import type { APIInterface } from "supertokens-node/recipe/thirdpartyemailpassword/types";

const generatePasswordResetTokenPOST = (
  originalImplementation: APIInterface
): typeof originalImplementation.generatePasswordResetTokenPOST => {
  return async (input) => {
    if (originalImplementation.generatePasswordResetTokenPOST === undefined) {
      throw new Error("Should never come here");
    }

    input.formFields = updateFields(
      input.formFields,
      input.options.req.original.tenant
    );

    const originalResponse =
      await originalImplementation.generatePasswordResetTokenPOST(input);

    return originalResponse;
  };
};

export default generatePasswordResetTokenPOST;
