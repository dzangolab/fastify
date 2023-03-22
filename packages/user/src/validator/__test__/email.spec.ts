import { describe, expect, it } from "vitest";

import validateEmail from "../email";

import type { ApiConfig } from "@dzangolab/fastify-config";

describe("validateEmail", () => {
  const config = {
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

  it("return required message when email is undefined", async () => {
    const email = undefined as unknown as string;

    const emailValidation = validateEmail(email, config);

    expect(emailValidation).toEqual({
      message: "Email is required",
      success: false,
    });
  });

  it("return invalid message when email is invalid", async () => {
    const email = "user";

    const emailValidation = validateEmail(email, config);

    expect(emailValidation).toEqual({
      message: "Email is invalid",
      success: false,
    });
  });

  it("return success message when email is valid", async () => {
    const email = "user@example.com";

    const emailValidation = validateEmail(email, config);

    expect(emailValidation).toEqual({ success: true });
  });

  it("return not success message when email domain not in hostWhitelist", async () => {
    const hostWhitelist = ["example.com"];

    config.user.supertokens.validatorOptions.email.host_whitelist =
      hostWhitelist;
    const email = "user@monorepo.com";

    const emailValidation = validateEmail(email, config);

    expect(emailValidation).toEqual({
      message: "Email is invalid",
      success: false,
    });

    config.user.supertokens.validatorOptions.email.host_whitelist = [];
  });

  it("return success message when email domain in hostWhitelist", async () => {
    const hostWhitelist = ["example.com"];

    config.user.supertokens.validatorOptions.email.host_whitelist =
      hostWhitelist;

    const email = "user@example.com";

    const emailValidation = validateEmail(email, config);

    expect(emailValidation).toEqual({
      success: true,
    });

    config.user.supertokens.validatorOptions.email.host_whitelist = [];
  });

  it("return not success message when email domain not in supportedEmailDomains", async () => {
    const supportedEmailDomains = ["example.com"];

    config.user.supertokens.supportedEmailDomains = supportedEmailDomains;

    const email = "user@dzangolab.com";

    const emailValidation = validateEmail(email, config);

    expect(emailValidation).toEqual({
      message: "Email is invalid",
      success: false,
    });

    config.user.supertokens.supportedEmailDomains = [""];
  });

  it("return success message when email domain in supportedEmailDomains", async () => {
    const supportedEmailDomains = ["example.com"];

    config.user.supertokens.supportedEmailDomains = supportedEmailDomains;

    const email = "user@example.com";

    const emailValidation = validateEmail(email, config);

    expect(emailValidation).toEqual({
      success: true,
    });

    config.user.supertokens.supportedEmailDomains = [""];
  });

  it("return not success message when email domain not in supportedEmailDomains or hostWhitelist", async () => {
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

    config.user.supertokens.validatorOptions.email.host_whitelist = [];
    config.user.supertokens.supportedEmailDomains = [""];
  });

  it("return success message when email domain in supportedEmailDomains or hostWhitelist", async () => {
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

    config.user.supertokens.validatorOptions.email.host_whitelist = [];
    config.user.supertokens.supportedEmailDomains = [""];
  });
});
