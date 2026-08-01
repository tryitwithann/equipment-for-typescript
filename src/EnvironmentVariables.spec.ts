import {describe, expect, test} from "vitest";
import {requireEnvVar} from "./EnvironmentVariables";


describe("Require environment variable", () => {
    test("Throws when ENV var does not exist", () => {
        const expectedError = new Error(`Failed to load environment variable named: "X_FAVORITE_PRODUCT"`);

        expect(() => requireEnvVar("X_FAVORITE_PRODUCT")).toThrow(expectedError);
    });

    test("Returns value as text when ENV var exists", () => {
        process.env['X_FAVORITE_PRODUCT'] = 'ANN';
        const expected = 'ANN';

        expect(requireEnvVar("X_FAVORITE_PRODUCT")).toBe(expected);
    });
});
