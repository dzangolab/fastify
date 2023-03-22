import type { StrongPasswordOptions } from "../types";

const getErrorMessage = (options?: StrongPasswordOptions): string => {
  let errorMessage = "Password is too weak";

  if (!options) {
    return errorMessage;
  }

  const messages: string[] = [];

  if (options.minLength) {
    const length = options.minLength;

    if (length > 1) {
      messages.push(`minimum ${length} characters`);
    } else {
      messages.push(`minimum ${length} character`);
    }
  }

  if (options.minLowercase) {
    const length = options.minLowercase;

    if (length > 1) {
      messages.push(`minimum ${length} lowercases`);
    } else {
      messages.push(`minimum ${length} lowercase`);
    }
  }

  if (options.minUppercase) {
    const length = options.minUppercase;

    if (length > 1) {
      messages.push(`minimum ${length} uppercases`);
    } else {
      messages.push(`minimum ${length} uppercase`);
    }
  }

  if (options.minNumbers) {
    const length = options.minNumbers;

    if (length > 1) {
      messages.push(`minimum ${length} numbers`);
    } else {
      messages.push(`minimum ${length} number`);
    }
  }

  if (options.minSymbols) {
    const length = options.minSymbols;

    if (length > 1) {
      messages.push(`minimum ${length} symbols`);
    } else {
      messages.push(`minimum ${length} symbol`);
    }
  }

  if (messages.length > 0) {
    errorMessage = "Passsword should contain ";

    const lastMessage = messages.pop();

    if (messages.length > 0) {
      errorMessage += messages.join(", ") + " and ";
    }

    errorMessage += lastMessage;
  }

  return errorMessage;
};

export default getErrorMessage;
