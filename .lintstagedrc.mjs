export default {
	'*.*': filenames => [`case-police  --fix ${filenames.join(' ')}`],
	'*.{json,mjs,ts}?(x)': filenames => [
		`eslint --fix ${filenames.join(' ')}`,
		`tsc ${filenames.filter(filename => ['ts'].includes(filename)).join(' ')}`,
		`vitest run ${filenames.join(' ')} --passWithNoTests`,
	],
};
