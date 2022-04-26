import { Handler, schedule } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

import { getNewestMix, getWebhook } from '@src/spicey-la-vicey';

const {
    SUPABASE_URL = '',
    SUPABASE_API_KEY = '',
} = process.env;

const $supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);

export const handler: Handler = schedule('0 0-12 * * 2', async () => {
    try {
        const mix = await getNewestMix();

        const { data: mixDB } = await $supabase
            .from('spicey-la-vicey')
            .select('timestamp')
            .limit(1)
            .single();

        const { timestamp: timestampDB } = mixDB;

        if (mix.timestamp > timestampDB) {
            await $supabase
                .from('spicey-la-vicey')
                .update({
                    timestamp: mix.timestamp,
                })
                .eq('id', 1);

            await getWebhook(mix);
        }

        return {
            statusCode: 200,
        };
    } catch {
        return {
            statusCode: 500,
        };
    }
});
