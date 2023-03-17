/* eslint-disable unicorn/no-useless-undefined */

import { describe, expect, it } from "vitest";

import validatePassword from "../validatePassword";

describe.concurrent("ValidatePassword", () => {
  it("false when password length less than 8", async () => {
    const password = "Qwert1";

    const passwordValidation = validatePassword(password);

    expect(passwordValidation.success).toStrictEqual(false);

    if (!passwordValidation.success) {
      expect(passwordValidation.error.issues[0].message).toEqual(
        "Password must contain at least 8 characters"
      );
    }
  });

  it("false when password does not contain alphabet", async () => {
    const password = "1234567890";

    const passwordValidation = validatePassword(password);

    expect(passwordValidation.success).toStrictEqual(false);

    if (!passwordValidation.success) {
      expect(passwordValidation.error.issues[0].message).toEqual(
        "Password must contain at least one alphabet"
      );
    }
  });

  it("false when password does not contain number", async () => {
    const password = "Qwertyui";

    const passwordValidation = validatePassword(password);

    expect(passwordValidation.success).toStrictEqual(false);

    if (!passwordValidation.success) {
      expect(passwordValidation.error.issues[0].message).toEqual(
        "Password must contain at least one number"
      );
    }
  });

  it("true when all the contiditon met", async () => {
    const password = "Qwerty12";

    const passwordValidation = validatePassword(password);

    expect(passwordValidation.success).toStrictEqual(true);
  });
});
