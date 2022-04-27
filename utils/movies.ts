export const getTitle = (string: string): string => {
    const altTag = (/<img.*?alt="(.*?)"/g).exec(string);

    if (altTag !== null) {
        const [, value] = altTag;

        return value;
    }

    const fallbackContent = (/--no-poster">(.*?)<\/div>/g).exec(string);

    if (fallbackContent !== null) {
        const [, value] = fallbackContent;

        return value;
    }

    return '';
};

export const getPoster = (string: string): string => {
    const jpgSource = (/type="image\/jpeg" srcset=".*?, (.*?) 2x"/g).exec(string);

    if (jpgSource !== null) {
        const [, value] = jpgSource;

        return value;
    }

    const fallbackImage = (/<img.*?data-src="(.*?)"/g).exec(string);

    if (fallbackImage !== null) {
        const [, value] = fallbackImage;

        return value;
    }

    return '';
};

export const getLink = (title: string): string => `https://trakt.tv/search?query=${encodeURIComponent(title.toLowerCase())}`;
