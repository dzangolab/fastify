interface StrongPasswordOptions {
    /**
     * Minimum password length
     *
     * @default 8
     */
    minLength?: number | undefined;
    /**
     * Minimum number of lowercase letters
     *
     * @default 1
     */
    minLowercase?: number | undefined;
    /**
     * Minimum number of upercase letters
     *
     * @default 1
     */
    minUppercase?: number | undefined;
    /**
     * Minimum number of numbers
     *
     * @default 1
     */
    minNumbers?: number | undefined;
    /**
     * Minimum number of symbols
     *
     * @default 1
     */
    minSymbols?: number | undefined;
    /**
     * Whether or not the validator should return the score
     *
     * @default false
     */
    /**
     * Points earned for each unique character
     *
     * @default 1
     */
    pointsPerUnique?: number | undefined;
    /**
     *  Point earned for each repeated character
     *
     * @default 0.5
     */
    pointsPerRepeat?: number | undefined;
    /**
     * Points earned for containing lowercase characters
     *
     * @default 10
     */
    pointsForContainingLower?: number | undefined;
    /**
     * Points earned for containing uppercase characters
     * @default 10
     *
     */
    pointsForContainingUpper?: number | undefined;
    /**
     * Points earned for containing numbers
     *
     * @default 10
     *
     */
    pointsForContainingNumber?: number | undefined;
    /**
     * Points earned for containing symbols
     *
     * @default 10
     *
     */
    pointsForContainingSymbol?: number | undefined;
}
export type { StrongPasswordOptions };
//# sourceMappingURL=strongPasswordOptions.d.ts.map