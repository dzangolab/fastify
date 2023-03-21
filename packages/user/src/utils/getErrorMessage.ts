import { StrongPasswordOptions } from "../types";

const getErrorMessage = (options?: StrongPasswordOptions): string => {
  if (!options) {
    return "Password is too weak";
  }

  const messages: string[] = [];

  if (options.minLength) {
    messages.push(`minimum ${options.minLength} character`);
  }

  if (options.minLowercase) {
    messages.push(`minimum ${options.minLowercase} lowercase`);
  }

  if (options.minUppercase) {
    messages.push(`minimum ${options.minUppercase} uppercase`);
  }

  if (options.minNumbers) {
    messages.push(`minimum ${options.minNumbers} number`);
  }

  if (options.minSymbols) {
    messages.push(`minimum ${options.minSymbols} symbol`);
  }

  return "Passsword should contain " + messages.join(", ");
};

export default getErrorMessage;
