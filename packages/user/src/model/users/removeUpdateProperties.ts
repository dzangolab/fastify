import humps from "humps";

import type { UserUpdateInput } from "../../types";

const ignoredUpdateProperties = new Set([
  "id",
  "email",
  "lastLoginAt",
  "roles",
  "signedUpAt",
]) as Set<keyof UserUpdateInput>;

const removeUpdateProperties = (updateInput: UserUpdateInput) => {
  for (const key of Object.keys(updateInput)) {
    if (
      ignoredUpdateProperties.has(humps.camelize(key) as keyof UserUpdateInput)
    ) {
      delete updateInput[key as keyof UserUpdateInput];
    }
  }
};

export default removeUpdateProperties;

export { ignoredUpdateProperties };
