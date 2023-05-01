import { $supabase } from '@/lambda/spicey-la-vicey/supabase';

export const handleBefore = async () => {
	const { data } = await $supabase
		.from('spicey-la-vicey')
		.select()
		.limit(2);

	if (!data || data.length < 2) {
		throw new Error('[handleBefore] Data is incorrect, please check');
	}

	const [
		show,
		mix,
	] = data;

	if (!show.update) {
		$supabase
			.from('spicey-la-vicey')
			.update({ update: true })
			.eq('id', 1);
	}

	if (!mix.update) {
		$supabase
			.from('spicey-la-vicey')
			.update({ update: true })
			.eq('id', 2);
	}
};
