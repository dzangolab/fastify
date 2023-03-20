interface EmailErrorMessages {
  invalid?: string;
  required?: string;
}

interface PasswordErrorMessages {
  required?: string;
  weak?: string;
}

export type { EmailErrorMessages, PasswordErrorMessages };

export type { IsEmailOptions } from "./isEmailOptions";

export type { StrongPasswordOptions } from "./strongPasswordOptions";
