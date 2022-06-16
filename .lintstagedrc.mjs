export default {
    '*.*': filenames => [`case-police  --fix ${filenames.join(' ')}`],
    '*.{json,mjs,ts}?(x)': filenames => [
        `eslint ${filenames.join(' ')}`,
        `vitest ${filenames.join(' ')} --passWithNoTests`,
    ],
};
