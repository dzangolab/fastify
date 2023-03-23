import { describe, expect, it } from "vitest";

import validatePassword from "../password";

import type { ApiConfig } from "@dzangolab/fastify-config";

describe("validatePassword", () => {
  const config = {
    user: {
      supertokens: {
        validatorOptions: {},
      },
    },
  } as unknown as ApiConfig;

  it("returns error object when password field is not present", async () => {
    const password = undefined as unknown as string;

    const passwordValidation = validatePassword(password, config);

    expect(passwordValidation).toEqual({
      message: "Password is required",
      success: false,
    });
  });

  it("returns error object when password field is empty string", async () => {
    const password = "";

    const passwordValidation = validatePassword(password, config);

    expect(passwordValidation).toEqual({
      message: "Passsword should contain minimum 8 characters",
      success: false,
    });
  });

  it("returns error object when password is weak", async () => {
    const password = "aaaaaaa";

    const passwordValidation = validatePassword(password, config);

    expect(passwordValidation).toEqual({
      message: "Passsword should contain minimum 8 characters",
      success: false,
    });
  });

  it("returns success object when password is strong", async () => {
    const password = "aaaaaaaa";

    const passwordValidation = validatePassword(password, config);

    expect(passwordValidation).toEqual({
      success: true,
    });
  });

  it("returns error object when password length less than minLength", async () => {
    const strongPasswordOptions = {
      minLength: 10,
    };

    config.user.supertokens.validatorOptions.password = strongPasswordOptions;

    const password = "Qwerty";

    const passwordValidation = validatePassword(password, config);

    expect(passwordValidation).toEqual({
      message: "Passsword should contain minimum 10 characters",
      success: false,
    });
  });

  it("returns error objects when all provided options are not satsfied", async () => {
    const strongPasswordOptions = {
      minLength: 1,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    };

    config.user.supertokens.validatorOptions.password = strongPasswordOptions;

    const password = "Qwerty12";

    const passwordValidation = validatePassword(password, config);

    expect(passwordValidation).toEqual({
      message:
        "Passsword should contain minimum 1 character, minimum 1 lowercase, minimum 1 uppercase, minimum 1 number and minimum 1 symbol",
      success: false,
    });
  });

  it("returns success object when all provided options are satsfied", async () => {
    const strongPasswordOptions = {
      minLength: 1,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    };

    config.user.supertokens.validatorOptions.password = strongPasswordOptions;

    const password = "Qwerty1!";

    const passwordValidation = validatePassword(password, config);

    expect(passwordValidation).toEqual({
      success: true,
    });
  });

  it("returns error objects when custom strongPasswordOptions are provided", async () => {
    const strongPasswordOptions = {
      minLength: 2,
      minLowercase: 2,
      minUppercase: 2,
      minNumbers: 2,
      minSymbols: 2,
    };

    config.user.supertokens.validatorOptions.password = strongPasswordOptions;

    const password = "Qwerty12";

    const passwordValidation = validatePassword(password, config);

    expect(passwordValidation).toEqual({
      message:
        "Passsword should contain minimum 2 characters, minimum 2 lowercases, minimum 2 uppercases, minimum 2 numbers and minimum 2 symbols",
      success: false,
    });
  });

  it("returns success object when password pass the provided strongPasswordOptions", async () => {
    const strongPasswordOptions = {
      minLength: 2,
      minLowercase: 2,
      minUppercase: 2,
      minNumbers: 2,
      minSymbols: 2,
    };

    config.user.supertokens.validatorOptions.password = strongPasswordOptions;

    const password = "QwertY12!@";

    const passwordValidation = validatePassword(password, config);

    expect(passwordValidation).toEqual({
      success: true,
    });
  });
});
