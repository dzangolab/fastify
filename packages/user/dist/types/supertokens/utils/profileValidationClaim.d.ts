import { SessionClaim } from "supertokens-node/lib/build/recipe/session/claims";
import type { SessionClaimValidator } from "supertokens-node/recipe/session";
interface Response {
    gracePeriodEndsAt?: number;
    isVerified: boolean;
}
declare class ProfileValidationClaim extends SessionClaim<Response> {
    static defaultMaxAgeInSeconds: number | undefined;
    static key: string;
    constructor();
    addToPayload_internal(payload: any, value: Response, _userContext: any): any;
    fetchValue: (userId: string, userContext: any) => Promise<Response>;
    getLastRefetchTime(payload: any, _userContext: any): number | undefined;
    getValueFromPayload(payload: any, _userContext: any): Response | undefined;
    removeFromPayload(payload: any, _userContext: any): any;
    removeFromPayloadByMerge_internal(payload: any, _userContext: any): any;
    validators: {
        isVerified: (maxAgeInSeconds?: number | undefined, id?: string) => SessionClaimValidator;
    };
}
export default ProfileValidationClaim;
//# sourceMappingURL=profileValidationClaim.d.ts.map