const formatUrl = (url: string) => {
	const instagramUrl = new URL(url);
	const instagramParameters = new URLSearchParams({
		__a: '1',
		__d: 'dis',
	}).toString();

	return new URL(`${instagramUrl.origin}${instagramUrl.pathname}?${instagramParameters}`).toString();
};

const getVideoInfo = async (url: string) => {
	const response = await fetch(url);
	const json = await response.json();

	const videoUrl = new URL(json.graphql.shortcode_media.video_url);
	const filename = videoUrl.pathname.split('/').at(-1);

	return {
		filename,
		url: videoUrl.toString(),
	};
};

export const prepareFormData = async (url: string) => {
	const videoInfo = await getVideoInfo(formatUrl(url));
	const file = await fetch(videoInfo.url);
	const blob = await file.blob();

	const formData = new FormData();
	formData.append('file', blob, videoInfo.filename);

	return formData;
};
