import { describe, expect, it } from "vitest";

import validatePassword from "../validatePassword";

describe.concurrent("validatePassword", () => {
  it("false when password lenght is 0", async () => {
    const password = "";

    const passwordValidation = validatePassword(password);

    expect(passwordValidation.success).toStrictEqual(false);

    if (!passwordValidation.success) {
      expect(passwordValidation.error.issues[0].message).toEqual(
        "Password must contain at least 8 characters, including a number"
      );
    }
  });

  it("false when password length less than 8", async () => {
    const password = "Qwert1";

    const passwordValidation = validatePassword(password);

    expect(passwordValidation.success).toStrictEqual(false);

    if (!passwordValidation.success) {
      expect(passwordValidation.error.issues[0].message).toEqual(
        "Password must contain at least 8 characters, including a number"
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

  it("true when small letter and number used", async () => {
    const password = "qwerty12";

    const passwordValidation = validatePassword(password);

    expect(passwordValidation.success).toStrictEqual(true);
  });

  it("true when capital letter and number used", async () => {
    const password = "QWERTY12";

    const passwordValidation = validatePassword(password);

    expect(passwordValidation.success).toStrictEqual(true);
  });

  it("true when both small and capital letter and number used", async () => {
    const password = "Qwerty12";

    const passwordValidation = validatePassword(password);

    expect(passwordValidation.success).toStrictEqual(true);
  });

  it("true when letter, number and other special character used", async () => {
    const password = "Qwer1#$*&";

    const passwordValidation = validatePassword(password);

    expect(passwordValidation.success).toStrictEqual(true);
  });
});
