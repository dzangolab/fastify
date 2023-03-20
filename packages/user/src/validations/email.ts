import { emailSchema } from "./schemas";

const validateEmail = (
  email: string,
  supportedEmailDomains: string[] | undefined
) => {
  return emailSchema(
    {
      invalid: "Email is invalid",
      required: "Email is invalid",
    },
    {
      host_whitelist: supportedEmailDomains,
    }
  ).safeParse(email);
};

export default validateEmail;
