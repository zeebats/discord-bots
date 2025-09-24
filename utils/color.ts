import { type AnyColor, colord } from 'colord';

export const produceDecimalColor = (color: AnyColor) => {
	let parsedColor = colord(color);

	// Unfortunately Discord won't accept pure black, so we have to reassign with "off-by-one black"
	if (parsedColor.isEqual('#000000')) {
		parsedColor = colord('#000001');
	}

	const { b, g, r } = parsedColor.toRgb();

	return (r << 16) + (g << 8) + b;
};
