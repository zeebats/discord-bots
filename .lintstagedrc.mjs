export default {
    '*.{json,mjs,ts}?(x)': filenames => [
        `eslint ${filenames.join(' ')}`,
        `vitest ${filenames.join(' ')} --passWithNoTests`,
    ],
};
