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

  const formIds = new Set(formFields.map((formField) => formField.id));

  for (const preDefinedField of getDefinedFields(config)) {
    if (!formIds.has(preDefinedField.id)) {
      formFields.push(preDefinedField);
    }
  }

  return formFields;
};

const getDefinedFields = (config: ApiConfig): TypeInputFormField[] => {
  return [
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
};

export default getFormFields;
