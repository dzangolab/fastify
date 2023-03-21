import { describe, expect, it } from "vitest";

import validatePassword from "../password";

import type { FastifyInstance } from "fastify";

const fastify = {
  config: {
    user: {
      supertokens: {
        validatorOptions: {
          password: {
            minLength: 8,
            minLowercase: 2,
            minUppercase: 2,
            minNumbers: 2,
            minSymbols: 2,
          },
        },
      },
    },
  },
} as unknown as FastifyInstance;

describe.concurrent("validatePassword", () => {
  it("fail when field empty", async () => {
    fastify.config.user.supertokens.validatorOptions.password = undefined;

    const password = "";

    const passwordValidation = await validatePassword(fastify)(password);

    expect(passwordValidation).toEqual("Password is too weak");
  });
});
