/* istanbul ignore file */
import { describe, expect, it } from "vitest";

import removeUpdateProperties from "../removeUpdateProperties";

import type { UserUpdateInput } from "../../../types";

describe("removeUpdateProperties", () => {
  it("should not remove valid input property", () => {
    const updateInput = {
      middleNames: "A",
    } as UserUpdateInput;

    removeUpdateProperties(updateInput);

    expect(updateInput).toHaveProperty("middleNames");
  });

  it("should remove ignored input property", () => {
    const updateInput = {
      email: "user@example.com",
    } as UserUpdateInput;

    removeUpdateProperties(updateInput);

    expect(updateInput).not.toHaveProperty("email");
  });

  it("should remove ignored input (tricky) property", () => {
    const updateInput = {
      lastLogin_at: "2023-06-13 04:02:45.825",
    } as UserUpdateInput;

    removeUpdateProperties(updateInput);

    expect(updateInput).not.toHaveProperty("lastLogin_at");
  });

  it("should handel more than one input properties", () => {
    const updateInput = {
      email: "user@example.com",
      lastLogin_at: "2023-06-13 04:02:45.825",
      middleNames: "A",
    } as UserUpdateInput;

    removeUpdateProperties(updateInput);

    expect(updateInput).toHaveProperty("middleNames");
    expect(updateInput).not.toHaveProperty("email");
    expect(updateInput).not.toHaveProperty("lastLogin_at");
  });
});
