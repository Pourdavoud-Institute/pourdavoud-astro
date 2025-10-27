<script setup lang="ts">
import getYouTubeID from 'get-youtube-id';
import type { CollectionEntry } from 'astro:content';
import { computed } from 'vue';
import { format } from '@formkit/tempo';

interface Props {
    video: CollectionEntry<'videos'>;
}

const props = defineProps<Props>();

const youtubeThumbnailURL = computed(() => {
    const id = getYouTubeID(props.video.data.url);
    return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
});

const eventTitle = computed(() => {
    if (props.video.data.eventFiltersRef.length > 0) {
        const event = props.video.data.eventFiltersRef[0];

        if (event._type === 'event') {
            return `Part of “${event.title}”`;
        }

        return event.title;
    }

    return undefined;
});

const speakersList = computed(() => {
    if (props.video.data.speakersRef.length > 0) {
        return props.video.data.speakersRef;
    }

    return undefined;
});
</script>

<template>
    <article class="video-preview">
        <a class="image-wrapper" :href="`/media${video.data.slug}`">
            <div class="overlay">
                <h2 class="title">{{ video.data.title }}</h2>
                <svg
                    aria-hidden="true"
                    class="ucla-icon__play-circle"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M9.5 16.5L16.5 12L9.5 7.5L9.5 16.5ZM12 22C10.6167 22 9.31666 21.7373 8.1 21.212C6.88333 20.6873 5.825 19.975 4.925 19.075C4.025 18.175 3.31266 17.1167 2.788 15.9C2.26266 14.6833 2 13.3833 2 12C2 10.6167 2.26267 9.31667 2.788 8.1C3.31267 6.88333 4.025 5.825 4.925 4.925C5.825 4.025 6.88333 3.31233 8.1 2.787C9.31667 2.26233 10.6167 2 12 2C13.3833 2 14.6833 2.26234 15.9 2.787C17.1167 3.31234 18.175 4.025 19.075 4.925C19.975 5.825 20.6873 6.88334 21.212 8.1C21.7373 9.31667 22 10.6167 22 12C22 13.3833 21.7373 14.6833 21.212 15.9C20.6873 17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6873 15.9 21.212C14.6833 21.7373 13.3833 22 12 22ZM12 20C14.2333 20 16.125 19.225 17.675 17.675C19.225 16.125 20 14.2333 20 12C20 9.76667 19.225 7.875 17.675 6.325C16.125 4.775 14.2333 4 12 4C9.76667 4 7.875 4.775 6.325 6.325C4.775 7.875 4 9.76667 4 12C4 14.2333 4.775 16.125 6.325 17.675C7.875 19.225 9.76666 20 12 20Z"
                    />
                </svg>
            </div>
            <img
                :src="youtubeThumbnailURL"
                :alt="video.data.title"
                :width="300"
                :height="168"
                loading="lazy"
                decoding="async"
            />
        </a>
        <div class="text-wrapper | flow">
            <!-- <h2 class="visually-hidden">{{ video.data.title }}</h2> -->
            <div class="speakers" v-if="speakersList">
                <template v-for="speaker in speakersList" :key="speaker._id">
                    <p>
                        <strong>{{ speaker.title }}</strong>
                        <span v-if="speaker.institution"
                            >, {{ speaker.institution }}</span
                        >
                    </p>
                </template>
            </div>
            <p class="date">
                {{ format(video.data.date, 'ddd MMMM D, YYYY') }}
            </p>
            <div class="details">
                <span v-if="eventTitle"
                    ><em>{{ eventTitle }}</em></span
                >
            </div>
        </div>
    </article>
</template>
