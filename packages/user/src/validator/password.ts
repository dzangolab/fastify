import { passwordSchema } from "./schemas";
import getErrorMessage from "../utils/getErrorMessage";

import type { StrongPasswordOptions } from "../types";

const validatePassword = (
  password: string,
  strongPasswordOptions: StrongPasswordOptions | undefined
) => {
  return passwordSchema(
    {
      required: "Password is required",
      weak: getErrorMessage(strongPasswordOptions),
    },
    strongPasswordOptions
  ).safeParse(password);
};

export default validatePassword;
