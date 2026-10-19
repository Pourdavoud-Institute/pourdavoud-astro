<script setup lang="ts">
import type { CollectionEntry } from 'astro:content';
import { format } from '@formkit/tempo';
import { computed } from 'vue';
import { formatSeconds } from '@lib/utils/formatSeconds';
import { splitPodcastTitle } from '@lib/utils/formatPodcast';
import v from 'voca';

interface Props {
    item: CollectionEntry<'podcast'>;
}

const { item } = defineProps<Props>();

const splitTitle = computed(() => splitPodcastTitle(item));

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
            <h3 class="title">
                <a :href="`/media/podcast/${v.slugify(item.data.title)}`">{{
                    splitTitle.title
                }}</a>
            </h3>
        </header>
        <div class="info">
            <time :datetime="isoDate">{{ format(item.data.pubDate) }}</time>
            <span v-if="item.data.duration" class="duration">{{
                formatSeconds(item.data.duration)
            }}</span>
        </div>
        <!-- <a
            v-if="item.data.media['@_url']"
            :href="item.data.link"
            target="_blank"
            >Episode Permalink</a
        > -->
    </article>
</template>
