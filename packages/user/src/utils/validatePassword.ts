import { z } from "zod";

const validatePassword = (password: string) => {
  const passwordValidationSchema = z
    .string()
    .min(8, "Password must contain at least 8 characters")
    .regex(
      /^(?=.*?[A-Za-z]).{8,}$/,
      "Password must contain at least one alphabet"
    )
    .regex(/^(?=.*?\d).{8,}$/, "Password must contain at least one number");

  return passwordValidationSchema.safeParse(password);
};

export default validatePassword;
