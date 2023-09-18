import { readFileSync } from 'node:fs';

const packageJSON = JSON.parse(readFileSync('./package.json'));

const filteredTasks =
	Object.entries(packageJSON.scripts)
		.filter(([
			key,
			value,
		]) => key.startsWith('lint') && !key.endsWith(':fix') && !value.startsWith('pnpm'))
		.map(([
			, value,
		]) => {
			let glob = value.match(/\*\*\/\*\.\S*(?=')/)?.[0] ?? '*';
			let command = value.match(/^.*(?=\s+'\*\*\/\*\.\S*(?!'))/)?.[0] ?? value;

			if (command.startsWith('astro')) {
				glob = '*.astro';
			}

			if (command.startsWith('tsc')) {
				glob = '*.ts?(x)';
				command = `bash -c ${command}`;
			}

			return [
				glob,
				command,
			];
		})
		.reduce((accumulator, item) => {
			if (accumulator.some(value => value[0] === item[0])) {
				const found = accumulator.findIndex(value => value[0] === item[0]);

				accumulator[found] = [
					accumulator[found][0],
					[
						...(Array.isArray(accumulator[found][1]) ? accumulator[found][1] : [accumulator[found][1]]),
						item[1],
					],
				];
			} else {
				accumulator.push(item);
			}

			return accumulator;
		}, [])
		.map(([
			glob,
			command,
		]) => {
			if (glob.startsWith('*.')) {
				return [
					glob,
					command,
				];
			}

			return [
				glob,
				filenames => [`${command} ${filenames.join(' ')}`],
			];
		});

const config = Object.fromEntries(filteredTasks);

export default config;
