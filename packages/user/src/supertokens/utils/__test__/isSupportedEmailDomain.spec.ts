import { describe, expect, it } from "vitest";

import isSupportedEmailDomain from "../isSupportedEmailDomain";

describe.concurrent("isSupportedEmailDomain", () => {
  it.each([
    ["", [], false],
    ["user", [], false],
    ["", ["user"], false],
    ["user@example.com", [], false],
    ["user@example.com", ["abc.com"], false],
    ["user@example.com", ["abc.com", "xzy.com"], false],
    ["user@example.com", ["example.com"], true],
    ["user@example.com", ["abc.com", "example.com"], true],
  ])(
    "isSupportedEmailDomain(email, supportedEmailDomains ) -> isSupported",
    async (email, supportedEmailDomains, isSupported) => {
      expect(isSupportedEmailDomain(email, supportedEmailDomains)).toBe(
        isSupported
      );
    }
  );
});
