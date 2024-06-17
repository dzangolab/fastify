/* eslint-disable unicorn/no-null */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { SessionClaim } from "supertokens-node/lib/build/recipe/session/claims";

import type { FastifyRequest } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";
import type { SessionClaimValidator } from "supertokens-node/recipe/session";

interface T {
  gracePeriodEndDate?: number;
  value: boolean;
}

class ProfileValidationClaim extends SessionClaim<T> {
  public static key = "profileValidation";
  public readonly defaultMaxAgeInSeconds: number | undefined = undefined;
  private _request: FastifyRequest | SessionRequest;

  constructor(request: FastifyRequest | SessionRequest) {
    super("profileValidation");
    this._request = request;
  }

  addToPayload_internal(payload: any, value: T, _userContext: any): any {
    return {
      ...payload,
      [this.key]: {
        v: value,
        t: Date.now(),
      },
    };
  }

  fetchValue = async (): Promise<T> => {
    const profileValidation =
      this._request.config.user.features?.profileValidation;

    if (!profileValidation?.enabled) {
      throw new Error("Profile validation is not enabled");
    }

    const user = this._request.user;

    if (!user) {
      throw new Error("User not found");
    }

    const fields = profileValidation.fields || [];

    const gracePeriodEndDate = profileValidation.gracePeriodInDays
      ? user.signedUpAt +
        profileValidation.gracePeriodInDays * (24 * 60 * 60 * 1000)
      : undefined;

    return {
      gracePeriodEndDate,
      value: !fields.some((field) => user[field] === null),
    };
  };

  getLastRefetchTime(payload: any, _userContext: any): number | undefined {
    return undefined;
  }

  getValueFromPayload(payload: any, _userContext: any): T | undefined {
    return payload[this.key]?.v;
  }

  removeFromPayload(payload: any, _userContext: any): any {
    const res = {
      ...payload,
    };
    delete res[this.key];

    return res;
  }

  removeFromPayloadByMerge_internal(payload: any, _userContext: any): any {
    const res = {
      ...payload,
      [this.key]: null,
    };

    return res;
  }

  validators = {
    isVerified: (
      maxAgeInSeconds: number | undefined = this.defaultMaxAgeInSeconds,
      id?: string
    ): SessionClaimValidator => {
      return {
        claim: this,
        id: id ?? this.key,
        shouldRefetch: (payload, context) => true,
        validate: async (payload, context) => {
          const expectedValue = true;

          const claimValue = this.getValueFromPayload(payload, context);

          if (claimValue === undefined) {
            return {
              isValid: false,
              reason: {
                message: "value does not exist",
                expectedValue,
                actualValue: undefined,
              },
            };
          }

          const ageInSeconds =
            (Date.now() - this.getLastRefetchTime(payload, context)!) / 1000;

          if (maxAgeInSeconds !== undefined && ageInSeconds > maxAgeInSeconds) {
            return {
              isValid: false,
              reason: {
                message: "expired",
                ageInSeconds,
                maxAgeInSeconds,
              },
            };
          }

          if (
            claimValue.value !== expectedValue &&
            (claimValue.gracePeriodEndDate
              ? claimValue.gracePeriodEndDate <= Date.now()
              : true)
          ) {
            return {
              isValid: false,
              reason: {
                message: "User profile is incomplete",
                expectedValue,
                actualValue: claimValue.value,
              },
            };
          }

          return { isValid: true };
        },
      };
    },
  };
}

export default ProfileValidationClaim;
