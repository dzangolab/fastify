import { z } from "zod";
import type { PasswordErrorMessages, StrongPasswordOptions } from "../types";
declare const defaultOptions: {
    minLength: number;
    minLowercase: number;
    minUppercase: number;
    minNumbers: number;
    minSymbols: number;
    returnScore: boolean;
    pointsPerUnique: number;
    pointsPerRepeat: number;
    pointsForContainingLower: number;
    pointsForContainingUpper: number;
    pointsForContainingNumber: number;
    pointsForContainingSymbol: number;
};
declare const schema: (errorMessages: PasswordErrorMessages, options: StrongPasswordOptions | undefined) => z.ZodEffects<z.ZodString, string, string>;
export default schema;
export { defaultOptions };
//# sourceMappingURL=password.d.ts.map