export default {
    '*.{json,ts}?(x)': (filenames) => `eslint ${filenames.join(' ')}`
}
