import { beforeEach, describe, expect, it } from "vitest";

import validateEmail from "../email";

import type { ApiConfig } from "@dzangolab/fastify-config";

describe("validateEmail", () => {
  let config = {} as unknown as ApiConfig;

  beforeEach(() => {
    config = {
      user: {
        supertokens: {
          supportedEmailDomains: [""],
          validatorOptions: {
            email: {
              host_whitelist: [],
            },
          },
        },
      },
    } as unknown as ApiConfig;
  });

  it("returns error object when email is undefined", async () => {
    const email = undefined as unknown as string;

    const emailValidation = validateEmail(email, config);

    expect(emailValidation).toEqual({
      message: "Email is required",
      success: false,
    });
  });

  it("returns error object when email is invalid", async () => {
    const email = "user";

    const emailValidation = validateEmail(email, config);

    expect(emailValidation).toEqual({
      message: "Email is invalid",
      success: false,
    });
  });

  it("returns success object when email is valid", async () => {
    const email = "user@example.com";

    const emailValidation = validateEmail(email, config);

    expect(emailValidation).toEqual({ success: true });
  });

  it("returns error object when email domain not present in hostWhitelist", async () => {
    const hostWhitelist = ["example.com"];

    config.user.supertokens.validatorOptions.email.host_whitelist =
      hostWhitelist;
    const email = "user@monorepo.com";

    const emailValidation = validateEmail(email, config);

    expect(emailValidation).toEqual({
      message: "Email is invalid",
      success: false,
    });
  });

  it("returns success object when email domain present in hostWhitelist", async () => {
    const hostWhitelist = ["example.com"];

    config.user.supertokens.validatorOptions.email.host_whitelist =
      hostWhitelist;

    const email = "user@example.com";

    const emailValidation = validateEmail(email, config);

    expect(emailValidation).toEqual({
      success: true,
    });
  });

  it("returns error object when email domain not present in supportedEmailDomains", async () => {
    const supportedEmailDomains = ["example.com"];

    config.user.supertokens.supportedEmailDomains = supportedEmailDomains;

    const email = "user@dzangolab.com";

    const emailValidation = validateEmail(email, config);

    expect(emailValidation).toEqual({
      message: "Email is invalid",
      success: false,
    });
  });

  it("returns success object when email domain present in supportedEmailDomains", async () => {
    const supportedEmailDomains = ["example.com"];

    config.user.supertokens.supportedEmailDomains = supportedEmailDomains;

    const email = "user@example.com";

    const emailValidation = validateEmail(email, config);

    expect(emailValidation).toEqual({
      success: true,
    });
  });

  it("returns error object when email domain not present in supportedEmailDomains or hostWhitelist", async () => {
    const hostWhitelist = ["dzangolab.com"];
    const supportedEmailDomains = ["example.com"];

    config.user.supertokens.validatorOptions.email.host_whitelist =
      hostWhitelist;
    config.user.supertokens.supportedEmailDomains = supportedEmailDomains;

    const email = "user@user.com";

    const emailValidation = validateEmail(email, config);

    expect(emailValidation).toEqual({
      message: "Email is invalid",
      success: false,
    });
  });

  it("returns success object when email domain present in supportedEmailDomains or hostWhitelist", async () => {
    const hostWhitelist = ["dzangolab.com"];
    const supportedEmailDomains = ["example.com"];

    config.user.supertokens.validatorOptions.email.host_whitelist =
      hostWhitelist;
    config.user.supertokens.supportedEmailDomains = supportedEmailDomains;

    const email = "user@example.com";

    const emailValidation = validateEmail(email, config);

    expect(emailValidation).toEqual({
      success: true,
    });
  });
});
