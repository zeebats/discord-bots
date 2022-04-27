import { Handler, schedule } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import { getHours, fromUnixTime, format } from 'date-fns';

import { useWebhook } from '@src/webhook';
import { Mix, getNewestMix } from '@src/spicey-la-vicey';

const {
    SUPABASE_URL,
    SUPABASE_API_KEY,
    WEBHOOK_SPICEY_LA_VICEY,
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

const handleUpdate = async (item: Mix) => {
    await $supabase
        .from('spicey-la-vicey')
        .update({
            timestamp: item.timestamp,
            title: item.title,
            update: false,
        })
        .eq('id', 1);

    await useWebhook({
        url: WEBHOOK_SPICEY_LA_VICEY,
        webhook: {
            embeds: [
                {
                    color: 13_189_196,
                    title: item.title,
                    description: `🌶🌶🌶\n\n${item.description}`,
                    thumbnail: {
                        url: 'https://emojis.slackmojis.com/emojis/images/1643509700/43992/hyper-drum-time.gif?1643509700',
                    },
                    url: item.link,
                    fields: [
                        {
                            inline: true,
                            name: '▶️',
                            value: `**[Listen now](${item.link})**`,
                        },
                        {
                            inline: true,
                            name: '🗄',
                            value: '**[All episodes](https://www.bbc.co.uk/sounds/brand/b09c12lj)**',
                        },
                    ],
                    footer: {
                        text: `Posted on: ${format(fromUnixTime(item.timestamp), 'dd MMMM')}`,
                    },
                },
            ],
        },
    });
};

const handleFinally = async () => {
    await $supabase
        .from('spicey-la-vicey')
        .update({
            update: false,
        })
        .eq('id', 1);

    await useWebhook({
        url: WEBHOOK_SPICEY_LA_VICEY,
        webhook: {
            embeds: [
                {
                    color: 4_944_171,
                    description: '🥦🥦🥦\n\nFinished checking new mixes, meh!',
                    title: 'No new mix this week',
                },
            ],
        },
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
