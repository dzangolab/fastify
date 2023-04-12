import validateEmail from "../../../../validator/email";
import validatePassword from "../../../../validator/password";

import type { ApiConfig } from "@dzangolab/fastify-config";
import type { TypeInputFormField } from "supertokens-node/lib/build/recipe/emailpassword/types";

const getFormFields = (config: ApiConfig): TypeInputFormField[] => {
  let formFields: TypeInputFormField[] = [];

  if (
    typeof config.user.supertokens?.recipes?.thirdPartyEmailPassword ===
    "object"
  ) {
    const fields =
      config.user.supertokens?.recipes?.thirdPartyEmailPassword.signUpFeature
        ?.formFields;

    if (fields) {
      formFields = [...fields];
    }
  }

  const preDefinedFields: TypeInputFormField[] = [
    {
      id: "email",
      validate: async (email) => {
        const result = validateEmail(email, config);

        if (!result.success) {
          return result.message;
        }
      },
    },
    {
      id: "password",
      validate: async (password) => {
        const result = validatePassword(password, config);

        if (!result.success) {
          return result.message;
        }
      },
    },
  ];

  const formIds = new Set(formFields.map((formField) => formField.id));

  for (const preDefinedField of preDefinedFields) {
    if (!formIds.has(preDefinedField.id)) {
      formFields.push(preDefinedField);
    }
  }

  return formFields;
};

export default getFormFields;
