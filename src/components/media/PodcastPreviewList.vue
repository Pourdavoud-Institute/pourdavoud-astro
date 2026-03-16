<script setup lang="ts">
import type { CollectionEntry } from 'astro:content';
import { format } from '@formkit/tempo';
import { computed } from 'vue';
import { formatSeconds } from '@lib/utils/formatSeconds';

interface Props {
    item: CollectionEntry<'podcast'>;
}

const { item } = defineProps<Props>();

const splitTitle = computed(() => {
    let title = item.data.title;
    let episode = '';
    const parts = title.split(':');
    if (parts.length > 1) {
        episode = parts[0];
        title = parts[1];
    }
    return {
        title,
        episode,
    };
});

const isoDate = computed(() => format(item.data.pubDate, 'YYYY-MM-DD'));
</script>

<template>
    <article class="podcast-preview__list | flow" data-tempo="vivace">
        <header>
            <p
                v-if="splitTitle.episode"
                class="small-title | eyebrow | cluster"
            >
                <span v-if="item.data.season" class="season"
                    >Season {{ item.data.season }}</span
                >
                <span>{{ splitTitle.episode }}</span>
            </p>
            <h3>{{ splitTitle.title }}</h3>
        </header>
        <div class="info">
            <time :datetime="isoDate">{{ format(item.data.pubDate) }}</time>
            <span v-if="item.data.duration" class="duration">{{
                formatSeconds(item.data.duration)
            }}</span>
        </div>
        <p class="description">
            {{ item.data.description }}
        </p>
        <div v-if="item.data.media['@_url']" class="player">
            <audio controls preload="metadata">
                <source
                    :src="item.data.media['@_url']"
                    :type="item.data.media['@_type']"
                />
                <a
                    :href="item.data.media['@_url']"
                    :download="item.data.media['@_url']"
                    >Download audio</a
                >
            </audio>
            <a
                v-if="item.data.media['@_url']"
                :href="item.data.link"
                target="_blank"
                >Episode Permalink</a
            >
        </div>
        <div></div>
    </article>
</template>
