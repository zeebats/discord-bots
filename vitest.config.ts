import path from 'node:path';
import url from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	// eslint-disable-next-line @typescript-eslint/naming-convention
	resolve: { alias: { '@': path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), './') } },
	test: {
		coverage: { provider: 'v8' },
		globals: true,
		includeSource: ['**/*.ts'],
	},
});
