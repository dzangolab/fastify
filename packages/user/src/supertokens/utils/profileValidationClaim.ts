/* eslint-disable unicorn/no-null */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

// reference https://github.com/supertokens/supertokens-node/blob/master/lib/ts/recipe/session/claimBaseClasses/primitiveArrayClaim.ts

import { SessionClaim } from "supertokens-node/lib/build/recipe/session/claims";

import type { FastifyRequest } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";
import type { SessionClaimValidator } from "supertokens-node/recipe/session";

interface Response {
  gracePeriodEndTimestamp?: number;
  isVerified: boolean;
}

class ProfileValidationClaim extends SessionClaim<Response> {
  public static key = "profileValidation";
  public static defaultMaxAgeInSeconds: number | undefined = undefined;
  private _request: FastifyRequest | SessionRequest;

  constructor(request: FastifyRequest | SessionRequest) {
    super("profileValidation");
    this._request = request;
  }

  addToPayload_internal(payload: any, value: Response, _userContext: any): any {
    return {
      ...payload,
      [this.key]: {
        v: value,
        t: Date.now(),
      },
    };
  }

  fetchValue = async (): Promise<Response> => {
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

    const isVerified = !fields.some((field) => user[field] === null);

    const gracePeriodEndTimestamp =
      !isVerified && profileValidation.gracePeriodInDays
        ? user.signedUpAt +
          profileValidation.gracePeriodInDays * (24 * 60 * 60 * 1000)
        : undefined;

    return {
      gracePeriodEndTimestamp,
      isVerified,
    };
  };

  getLastRefetchTime(payload: any, _userContext: any): number | undefined {
    return undefined;
  }

  getValueFromPayload(payload: any, _userContext: any): Response | undefined {
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
      maxAgeInSeconds:
        | number
        | undefined = ProfileValidationClaim.defaultMaxAgeInSeconds,
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

          if (
            claimValue.isVerified !== expectedValue &&
            (claimValue.gracePeriodEndTimestamp
              ? claimValue.gracePeriodEndTimestamp <= Date.now()
              : true)
          ) {
            return {
              isValid: false,
              reason: {
                message: "User profile is incomplete",
                expectedValue,
                actualValue: claimValue.isVerified,
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
