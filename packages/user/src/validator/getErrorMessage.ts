import type { StrongPasswordOptions } from "../types";

const getErrorMessage = (options?: StrongPasswordOptions): string => {
  if (!options) {
    return "Password is too weak";
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

  let message: string;

  if (messages.length === 0) {
    message = "Password is too weak";
  } else if (messages.length === 1) {
    message = "Passsword should contain " + messages[0];
  } else {
    const lastMessage = messages.pop();

    message =
      "Passsword should contain " + messages.join(", ") + " and " + lastMessage;
  }

  return message;
};

export default getErrorMessage;
