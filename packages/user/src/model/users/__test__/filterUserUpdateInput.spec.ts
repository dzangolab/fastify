/* istanbul ignore file */
import { describe, expect, it } from "vitest";

import filterUserUpdateInput from "../filterUserUpdateInput";

import type { UserUpdateInput } from "../../../types";

describe("removeUpdateProperties", () => {
  it("should not remove valid input key", () => {
    const updateInput = {
      middleNames: "A",
    } as UserUpdateInput;

    filterUserUpdateInput(updateInput);

    expect(updateInput).toHaveProperty("middleNames");
  });

  it("should remove ignored input key", () => {
    const updateInput = {
      email: "user@example.com",
    } as UserUpdateInput;

    filterUserUpdateInput(updateInput);

    expect(updateInput).not.toHaveProperty("email");
  });

  it("should remove ignored input (tricky) key", () => {
    const updateInput = {
      lastLogin_at: "2023-06-13 04:02:45.825",
    } as UserUpdateInput;

    filterUserUpdateInput(updateInput);

    expect(updateInput).not.toHaveProperty("lastLogin_at");
  });

  it("should handel more than one input keys", () => {
    const updateInput = {
      email: "user@example.com",
      lastLogin_at: "2023-06-13 04:02:45.825",
      middleNames: "A",
    } as UserUpdateInput;

    filterUserUpdateInput(updateInput);

    expect(updateInput).toHaveProperty("middleNames");
    expect(updateInput).not.toHaveProperty("email");
    expect(updateInput).not.toHaveProperty("lastLogin_at");
  });
});
