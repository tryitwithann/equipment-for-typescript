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
    if (!(key in process.env) || undefined === process.env[key]) {
        throw new Error(`Failed to load environment variable named: "${key}"`);
    }

    return process.env[key];
};
