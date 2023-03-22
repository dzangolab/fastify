import { describe, expect, it } from "vitest";

import validatePassword from "../password";

import type { FastifyInstance } from "fastify";

describe("validatePassword", () => {
  const fastify = {
    config: {
      user: {
        supertokens: {
          validatorOptions: {},
        },
      },
    },
  } as unknown as FastifyInstance;

  it("return required message when password field is not present", async () => {
    const password = undefined as unknown as string;

    const passwordValidation = await validatePassword(fastify)(password);

    expect(passwordValidation).toEqual("Password is required");
  });

  it("return weak password message when password field is empty string", async () => {
    const password = "";

    const passwordValidation = await validatePassword(fastify)(password);

    expect(passwordValidation).toEqual("Password is too weak");
  });

  it("return error message fail when password is weak", async () => {
    const password = "aaaaaaa";

    const passwordValidation = await validatePassword(fastify)(password);

    expect(passwordValidation).toEqual("Password is too weak");
  });

  it("return undefine when password is strong", async () => {
    const password = "aaaaaaaa";

    const passwordValidation = await validatePassword(fastify)(password);

    expect(passwordValidation).toEqual(undefined);
  });

  it("return custom error message when legth less than minLength", async () => {
    const strongPasswordOptions = {
      minLength: 8,
    };

    fastify.config.user.supertokens.validatorOptions.password =
      strongPasswordOptions;

    const password = "Qwerty";

    const passwordValidation = await validatePassword(fastify)(password);

    expect(passwordValidation).toEqual(
      "Passsword should contain minimum 8 characters"
    );
  });

  it("return custom error message when custom all option are not satsfied", async () => {
    const strongPasswordOptions = {
      minLength: 1,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    };

    fastify.config.user.supertokens.validatorOptions.password =
      strongPasswordOptions;

    const password = "Qwerty12";

    const passwordValidation = await validatePassword(fastify)(password);

    expect(passwordValidation).toEqual(
      "Passsword should contain minimum 1 character, minimum 1 lowercase, minimum 1 uppercase, minimum 1 number and minimum 1 symbol"
    );
  });

  it("return custom error message when custom strongPasswordOptions provided", async () => {
    const strongPasswordOptions = {
      minLength: 2,
      minLowercase: 2,
      minUppercase: 2,
      minNumbers: 2,
      minSymbols: 2,
    };

    fastify.config.user.supertokens.validatorOptions.password =
      strongPasswordOptions;

    const password = "Qwerty12";

    const passwordValidation = await validatePassword(fastify)(password);

    expect(passwordValidation).toEqual(
      "Passsword should contain minimum 2 characters, minimum 2 lowercases, minimum 2 uppercases, minimum 2 numbers and minimum 2 symbols"
    );
  });

  it("return undefine message when password pass the provided strongPasswordOptions", async () => {
    const strongPasswordOptions = {
      minLength: 2,
      minLowercase: 2,
      minUppercase: 2,
      minNumbers: 2,
      minSymbols: 2,
    };

    fastify.config.user.supertokens.validatorOptions.password =
      strongPasswordOptions;

    const password = "QwertY12!@";

    const passwordValidation = await validatePassword(fastify)(password);

    expect(passwordValidation).toEqual(undefined);
  });
});
