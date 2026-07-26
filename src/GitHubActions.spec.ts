import {describe, expect, it} from "vitest";

describe('Continuous Integration', () => {
    it('Should fail to prevent false positives', () => {
        expect(true).toBe(false)
    });
});
