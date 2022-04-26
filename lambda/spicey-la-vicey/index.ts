import { Handler } from '@netlify/functions';

import { getNewestMix } from '@src/spicey-la-vicey';

export const handler: Handler = async () => {
    try {
        const mix = await getNewestMix();

        return {
            body: JSON.stringify(mix),
            statusCode: 200,
            header: {
                'Content-Type': 'application/json',
            },
        };
    } catch (error) {
        return {
            body: JSON.stringify(error),
            header: {
                'Content-Type': 'application/json',
            },
            statusCode: 500,
        };
    }
};
