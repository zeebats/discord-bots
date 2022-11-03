export default {
	'*.*': filenames => [`case-police  --fix ${filenames.join(' ')}`],
	'*.{json,mjs,ts}?(x)': filenames => [
		`vitest run ${filenames.join(' ')} --passWithNoTests`,
		`eslint --fix ${filenames.join(' ')}`,
		`tsc ${filenames.filter(filename => ['ts'].includes(filename)).join(' ')}`,
		`case-police --fix ${filenames.join(' ')}`,
	],
};
