import {describe, expect, test} from "vitest";

const AllEnvVars = [
    "AWS_REGION",
    "AWS_ACCESS_KEY_ID",
    "AWS_SECRET_ACCESS_KEY",
    // ⬆️Actual environment variables
    // ⬇️Example for testing purposes
    "X_FAVORITE_PRODUCT",
] as const;
type AnyEnvVar = typeof AllEnvVars[number];

export const requireEnvVar = (key: AnyEnvVar): string => {
    throw new Error("TODO: Implement me");
};


describe("Require environment variable", () => {
    test("Throws when ENV var does not exist", () => {
        const expectedError = new Error(`Failed to load environment variable named: "X_FAVORITE_PRODUCT"`);

        expect(() => requireEnvVar("X_FAVORITE_PRODUCT")).toThrow(expectedError);
    });

    test("Returns value as text when ENV var exists", () => {
        process.env['X_FAVORITE_PRODUCT'] = 'ANN';
        const expected = 'paloma';

        expect(requireEnvVar("X_FAVORITE_PRODUCT")).toBe(expected);
    });
});
