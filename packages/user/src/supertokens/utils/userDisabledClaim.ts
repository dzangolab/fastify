import { BooleanClaim } from "supertokens-node/lib/build/recipe/session/claims";

import UserService from "../../model/users/service";

import type { User, UserCreateInput, UserUpdateInput } from "../../types";
import type { QueryResultRow } from "slonik";
import type { SessionClaimValidator } from "supertokens-node/recipe/session";

class UserDisabledClaimClass extends BooleanClaim {
  constructor() {
    super({
      key: "user-disabled",
      fetchValue: async (userId, userContext) => {
        const userService = new UserService<
          User & QueryResultRow,
          UserCreateInput,
          UserUpdateInput
        >(userContext.config, userContext.database);

        const user = await userService.findById(userId);

        if (!user) {
          throw new Error("UNKNOWN_USER_ID");
        }

        if (!user.disabled) {
          return true;
        }

        return true;
      },

      defaultMaxAgeInSeconds: 300,
    });

    this.validators = {
      ...this.validators,
      isDisabled: (
        refetchTimeOnFalseInSeconds = 10,
        maxAgeInSeconds = 300
      ) => ({
        ...this.validators.hasValue(true, maxAgeInSeconds),
        shouldRefetch: (payload, userContext) => {
          const value = this.getValueFromPayload(payload, userContext);
          return (
            value === undefined ||
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.getLastRefetchTime(payload, userContext)! <
              Date.now() - maxAgeInSeconds * 1000 ||
            (value === false &&
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              this.getLastRefetchTime(payload, userContext)! <
                Date.now() - refetchTimeOnFalseInSeconds * 1000)
          );
        },
      }),
    };
  }

  declare validators: BooleanClaim["validators"] & {
    isDisabled: (
      refetchTimeOnFalseInSeconds?: number,
      maxAgeInSeconds?: number
    ) => SessionClaimValidator;
  };
}

export default UserDisabledClaimClass;

export const userDisabledClaim = new UserDisabledClaimClass();
