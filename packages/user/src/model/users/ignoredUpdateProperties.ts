import type { UserUpdateInput } from "../../types";

const ignoredUserProperties = new Set([
  "id",
  "email",
  "lastLoginAt",
  "roles",
  "signedUpAt",
]) as Set<keyof UserUpdateInput>;

export default ignoredUserProperties;
