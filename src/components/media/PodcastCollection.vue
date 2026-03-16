<script setup lang="ts">
import type { CollectionEntry } from 'astro:content';
import { isBefore } from '@formkit/tempo';
import PodcastPreviewList from './PodcastPreviewList.vue';
import RekaSelect from '@components/reka-vue/RekaSelect.vue';
import VideoSearch from '@components/videos/filterControls/VideoSearch.vue';
import Fuse from 'fuse.js';
import { computed, ref } from 'vue';
import v from 'voca';

/** Props - from Astro */
interface Props {
    items: CollectionEntry<'podcast'>[];
    seasons: number[];
}

const { items, seasons } = defineProps<Props>();

/** Constants / Defaults */
type SortOptions = 'dateDesc' | 'dateAsc' | 'titleAsc' | 'titleDesc';
const DEFAULT_SORT: SortOptions = 'dateDesc';
const DEFAULT_SEASON = 'all';
const sortOptions: { text: string; value: string }[] = [
    {
        text: 'Date, Newest to Oldest',
        value: 'dateDesc',
    },
    {
        text: 'Date, Oldest to Newest',
        value: 'dateAsc',
    },
    {
        text: 'Title, A-Z',
        value: 'titleAsc',
    },
    {
        text: 'Title, Z-A',
        value: 'titleDesc',
    },
];
const seasonSelectOptions = computed(() => {
    const list = seasons.map((season) => ({
        text: `Season ${season}`,
        value: `${season}`,
    }));
    list.splice(0, 0, { text: 'All', value: 'all' });
    return list;
});

/** Refs */
// filter and sort refs
const activeSort = ref<SortOptions>(DEFAULT_SORT);
const activeSeasonFilter = ref<string>(DEFAULT_SEASON);
const activeSearchFilter = ref<string>(''); // query string

/** Filters */
// filter query with fuzzy search
const queryList = computed(() => {
    let list = items;

    // initialize new Fuse class for fuzzy search on title and description
    // options are set to be more conservative when finding results
    // weight description more than title, search farther into description
    const fuse = new Fuse(list, {
        keys: [
            {
                name: 'data.title',
                weight: 1,
            },
            {
                name: 'data.description',
                weight: 2,
            },
        ],
        ignoreDiacritics: true,
        includeScore: true,
        shouldSort: true,
        minMatchCharLength: 2,
        location: 0,
        threshold: 0.4,
        distance: 1500, // 0.4 x 1500 = 600 characters from location
    });

    if (activeSearchFilter.value) {
        // todo: pagination

        // return fuzzy search results, filter out scores above 0.7
        // (1.0 is complete mismatch)
        list = fuse
            .search(activeSearchFilter.value)
            .filter((item) => item.score && item.score < 0.75)
            .map((item) => item.item);
    }

    return list;
});

let filteredList = computed(() => {
    let list = queryList.value;

    // other filters
    if (activeSeasonFilter.value !== DEFAULT_SEASON) {
        list = list.filter(
            (item) => `${item.data.season}` === activeSeasonFilter.value,
        );
    }

    return list;
});

/** Sort */
const sortedList = computed(() => {
    // make copy of array because sort alters existing array in place
    // start with filtered list
    const list = [...filteredList.value];

    // sort by date w/ tempo
    if (activeSort.value === 'dateAsc' || activeSort.value === 'dateDesc') {
        return list.sort((a, b) => {
            if (isBefore(a.data.pubDate, b.data.pubDate)) {
                return activeSort.value === 'dateDesc' ? 1 : -1;
            }
            if (isBefore(b.data.pubDate, a.data.pubDate)) {
                return activeSort.value === 'dateDesc' ? -1 : 1;
            }
            return 0;
        });
    }

    return list.sort((a, b) => {
        // strip `Episode x:` from titles
        let titleA = a.data.title;
        const partsA = titleA.split(':');
        if (partsA.length > 1) {
            titleA = partsA[1];
        }

        let titleB = b.data.title;
        const partsB = titleB.split(':');
        if (partsB.length > 1) {
            titleB = partsB[1];
        }

        // standardize titles for more accurate sorting
        titleA = v.chain(titleA).slugify().value();
        titleB = v.chain(titleB).slugify().value();

        // strip starting `dr-`s
        if (v.startsWith(titleA, 'dr-')) {
            titleA = v.slice(titleA, 3);
        }
        if (v.startsWith(titleB, 'dr-')) {
            titleB = v.slice(titleB, 3);
        }

        if (titleA < titleB) {
            return activeSort.value === 'titleAsc' ? -1 : 1;
        }
        if (titleA > titleB) {
            return activeSort.value === 'titleAsc' ? 1 : -1;
        }
        return 0;
    });
});

/** Buttons / Clear Filters */
const showClearFilters = computed(() => {
    let show = false;
    // show if not default sort or search term present
    if (
        activeSort.value !== DEFAULT_SORT ||
        activeSeasonFilter.value !== DEFAULT_SEASON ||
        activeSearchFilter.value
    ) {
        show = true;
    }

    return show;
});

/** Helpers */
// reset the search filter and paginated list when input list is cleared
function clearSearch() {
    // todo: pagination
    activeSearchFilter.value = '';
}

function clearFilters() {
    clearSearch();
    activeSort.value = DEFAULT_SORT;
    activeSeasonFilter.value = DEFAULT_SEASON;
}

// todo: add pagination using sort list
// todo: add url query params in onMounted & watchEffect callbacks
</script>

<template>
    <div class="filters-panel | flow" data-tempo="allegro">
        <div class="cluster">
            <video-search
                :search="activeSearchFilter"
                placeholder-text="Search keywords"
                @update-search="(v) => (activeSearchFilter = v)"
                @clear-search="clearSearch"
            />
            <reka-select
                label="Filter by Season"
                input-name="seasonFilter"
                :filter-value="activeSeasonFilter"
                :select-options="seasonSelectOptions"
                @update-filter-value="(v) => (activeSeasonFilter = v)"
            />
            <reka-select
                label="Sort by"
                input-name="sort"
                :filter-value="activeSort"
                :select-options="sortOptions"
                @update-filter-value="(v) => (activeSort = v)"
            />
        </div>
        <div class="clear-filters | cluster">
            <button
                v-if="showClearFilters"
                class="button-link with-icon"
                data-style="primary-ghost"
                data-size="small"
                @click="clearFilters"
            >
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5Z"
                    />
                </svg>
                <span>Clear All Filters</span>
            </button>
        </div>
    </div>
    <div class="main-panel">
        <div class="podcast-list-wrapper">
            <ul
                id="podcast-list"
                class="podcast-list | flow"
                data-tempo="moderato"
            >
                <li v-for="item in sortedList" :key="item.id">
                    <podcast-preview-list :item="item" />
                </li>
            </ul>
        </div>
        <a class="back-to-top" href="#podcastFeed">Back to Top</a>
    </div>
</template>
