const { NETLIFY_DEV } = process.env;

export const ENV_DEV = Boolean(NETLIFY_DEV);
