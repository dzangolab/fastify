import { passwordSchema } from "./schemas";

const validatePassword = (password: string) => {
  return passwordSchema(
    {
      required: "Password is required",
      weak: "Password is weak",
    },
    /* eslint-disable-next-line  unicorn/no-useless-undefined */
    undefined
  ).safeParse(password);
};

export default validatePassword;
