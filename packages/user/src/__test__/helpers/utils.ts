import type {
  UserProfileCreateInput,
  UserProfileUpdateInput,
} from "../../types";

export const getFakeData = ():
  | UserProfileCreateInput
  | UserProfileUpdateInput => ({
  givenName: "John",
  surname: "Smith",
});
