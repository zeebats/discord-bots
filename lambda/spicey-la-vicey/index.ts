import { getNewestMix } from '@src/spicey-la-vicey';

export const handler = async (): Promise<{ statusCode: number; body: unknown; }> => {
    try {
        const mix = await getNewestMix();

        return {
            statusCode: 200,
            body: JSON.stringify(mix),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: error,
        };
    }
};
