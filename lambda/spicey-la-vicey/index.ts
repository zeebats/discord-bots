import { Handler, schedule } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import { getHours } from 'date-fns';

import { Mix, getNewestMix, getWebhook } from '@src/spicey-la-vicey';

const {
    SUPABASE_URL = '',
    SUPABASE_API_KEY = '',
} = process.env;

const $supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);

const handleBefore = async () => {
    await $supabase
        .from('spicey-la-vicey')
        .update({
            update: true,
        })
        .eq('id', 1);
};

const handleUpdate = async (mix: Mix) => {
    await $supabase
        .from('spicey-la-vicey')
        .update({
            timestamp: mix.timestamp,
            title: mix.title,
            update: false,
        })
        .eq('id', 1);

    await getWebhook({
        content: `🌶🌶🌶\n**${mix.title}**\n<${mix.link}>\n🌶🌶🌶`,
        embeds: [
            {
                image: {
                    url: 'https://emojis.slackmojis.com/emojis/images/1643509700/43992/hyper-drum-time.gif?1643509700',
                },
            },
        ],
    });
};

const handleFinally = async () => {
    await $supabase
        .from('spicey-la-vicey')
        .update({
            update: false,
        })
        .eq('id', 1);

    await getWebhook({
        content: '🥦🥦🥦\n**No new mix this week**\nFinished checking new mixes, meh!\n🥦🥦🥦',
    });
};

// eslint-disable-next-line max-statements
export const handler: Handler = schedule('0 0-12 * * 2', async () => {
    try {
        const currentHour = getHours(Date.now());

        const mix: Mix = await getNewestMix();

        const { data } = await $supabase
            .from('spicey-la-vicey')
            .select('timestamp, title, update')
            .limit(1)
            .single();

        const { timestamp, title, update } = data;

        if (currentHour === 0 && !update) {
            await handleBefore();
        }

        if (mix.timestamp > timestamp && mix.title !== title) {
            await handleUpdate(mix);
        }

        if (currentHour === 12 && update) {
            await handleFinally();
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
