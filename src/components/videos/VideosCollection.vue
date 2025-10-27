<script setup lang="ts">
import type { CollectionEntry } from 'astro:content';
import type { PersonSpeaker } from '@content/schemaFragments/sanityComponents';
import type { VideoEventFilter } from '@content/videos';
import { ref, computed, onMounted, watchEffect } from 'vue';
import {
    PaginationEllipsis,
    PaginationFirst,
    PaginationLast,
    PaginationList,
    PaginationListItem,
    PaginationNext,
    PaginationPrev,
    PaginationRoot,
    TooltipProvider,
} from 'reka-ui';
import VideoSort, {
    type SortTerm,
    type SortOptions,
} from './filterControls/VideoSort.vue';
import VideoFilter from './filterControls/VideoFilter.vue';
import VideoSearch from './filterControls/VideoSearch.vue';
import VideoPreview from './VideoPreview.vue';
import v from 'voca';

interface Props {
    videos: CollectionEntry<'videos'>[];
    events: VideoEventFilter[];
    speakers: PersonSpeaker[];
}

const props = defineProps<Props>();

// filter and sort refs - current state
const sort = ref<SortOptions>('dateDesc');
const searchFilter = ref<string>('');
const eventFilter = ref<VideoEventFilter>();
const speakerFilter = ref<PersonSpeaker>();
// pagination refs - current state
const currentPage = ref<number>(1);
const pageOffset = ref<number>(30);

const sortTerms: SortTerm[] = [
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

// component must be mounted to access browser APIs like `window`
onMounted(() => {
    // check for existing params in url when page is navigated to
    let params = new URLSearchParams(window.location.search);
    if (params.size) {
        // get param keys
        const sortParam = params.get('sort');
        const searchParam = params.get('q');
        const paginateParam = params.get('offset');
        // set params, validate against acceptable values
        // sort - validate that it is actual SortOption
        if (sortParam && sortTerms.some((t) => t.value === sortParam)) {
            sort.value = sortParam as SortOptions;
        } else {
            // fallback to default if malformed params
            sort.value = 'dateDesc';
        }
        // search
        if (searchParam) {
            searchFilter.value = searchParam ?? '';
        }
        // paginate - test if coerced value is a number or NaN
        if (paginateParam && !Number.isNaN(Number(paginateParam))) {
            // calculate current page from offset
            const offset = Number(paginateParam);
            currentPage.value = Math.round(offset / pageOffset.value) + 1;
        } else {
            // fallback to first page if malformed params
            currentPage.value = 1;
        }
    }

    // set new search params when refs change
    watchEffect(() => {
        // get current url and params
        const url = new URL(window.location.href);
        const params = url.searchParams;

        // reset existing params
        // sort
        params.set('sort', sort.value);
        // search
        if (searchFilter.value) {
            params.set('q', searchFilter.value);
        } else {
            params.delete('q');
        }
        // paginate
        if (currentPage.value > 1) {
            params.set(
                'offset',
                `${(currentPage.value - 1) * pageOffset.value}`,
            );
        } else {
            params.delete('offset');
        }

        // push state
        window.history.replaceState({}, '', url.toString());
    });
});

const filteredList = computed(() => {
    if (searchFilter.value) {
        // when a search value is present, reset pagination to 1
        currentPage.value = 1;

        // use voca to standardize input against video titles
        return props.videos.filter((item) =>
            v.includes(
                v.chain(item.data.title).lowerCase().latinise().value(),
                v.chain(searchFilter.value).lowerCase().latinise().value(),
            ),
        );
    }

    return props.videos;
});

const sortedList = computed(() => {
    // make copy because sort alters existing array in place
    // const list = [...props.videos];
    const list = [...filteredList.value];

    if (sort.value === 'dateAsc' || sort.value === 'dateDesc') {
        return list.sort((a, b) => {
            const dateA = new Date(a.data.date);
            const dateB = new Date(b.data.date);

            if (sort.value === 'dateDesc') {
                // latest to oldest
                return (dateB as any) - (dateA as any);
            }

            return (dateA as any) - (dateB as any);
        });
    }

    return list.sort((a, b) => {
        // standardize titles for more accurate sorting
        let titleA = v.chain(a.data.title).slugify().value();
        let titleB = v.chain(b.data.title).slugify().value();

        // strip starting `the-`s
        if (v.startsWith(titleA, 'the-')) {
            titleA = v.slice(titleA, 4);
        }
        if (v.startsWith(titleB, 'the-')) {
            titleB = v.slice(titleB, 4);
        }

        if (titleA < titleB) {
            return sort.value === 'titleAsc' ? -1 : 1;
        }
        if (titleA > titleB) {
            return sort.value === 'titleAsc' ? 1 : -1;
        }
        return 0;
    });
});

const paginatedList = computed(() => {
    // apply pagination
    // start from 0 so that page 2 is offset=30
    const offset = (currentPage.value - 1) * pageOffset.value;
    return sortedList.value.slice(offset, offset + pageOffset.value);
});

const videoCount = computed(() => {
    return filteredList.value.length;
});

const filterDescription = computed(() => {
    let message = '';
    if (videoCount.value === 1) {
        message = `Showing 1 result`;
    } else {
        message = `Showing ${videoCount.value} results`;
    }

    if (searchFilter.value) {
        message += ` for ${searchFilter.value}`;
    }

    return message;
});

// helper functions
/** Reset the search filter and paginated list when input is cleared */
function clearSearch() {
    searchFilter.value = '';
    currentPage.value = 1;
}

function scrollToTop(e: PointerEvent) {
    const container = document.querySelector('#videos-index');
    container?.scrollIntoView({ behavior: 'smooth' });
}
</script>

<template>
    <div>
        <div class="filters-panel">
            <div class="small-title">Filters</div>
            <div class="cluster">
                <VideoSearch
                    :search="searchFilter"
                    @update-search="(v) => (searchFilter = v)"
                    @clear-search="clearSearch"
                />
                <VideoFilter
                    title="Filter by Event"
                    name="eventFilter"
                    :filter="eventFilter"
                    :options="events"
                    @update-filter="(v) => (eventFilter = v)"
                />
                <VideoSort
                    :sort="sort"
                    :sort-terms="sortTerms"
                    @update-sort="(v) => (sort = v)"
                />
            </div>
        </div>
        <div class="main-panel">
            <div class="filter-description">
                <em>{{ filterDescription }}</em>
                <p>
                    event filter: {{ eventFilter?.title }},
                    {{ eventFilter?._id }}
                </p>
            </div>
            <div class="videos-list-wrapper">
                <!-- <p>current page: {{ currentPage }}</p> -->
                <ul class="videos-list | fluid-grid">
                    <li v-for="video in paginatedList" :key="video.id">
                        <VideoPreview :video="video" />
                    </li>
                </ul>
                <PaginationRoot
                    class="ui-pagination__root"
                    v-model:page="currentPage"
                    :total="videoCount"
                    :items-per-page="pageOffset"
                    :show-edges="true"
                    v-slot="{ page, pageCount }"
                    @update:page="(v) => console.log(`current page: ${v}`)"
                >
                    <PaginationList v-slot="{ items }">
                        <PaginationPrev asChild v-show="page !== 1">
                            <button
                                class="ui-pagination__button button-link"
                                data-size="small"
                                data-style="primary"
                                @click="scrollToTop"
                            >
                                Prev
                            </button>
                        </PaginationPrev>
                        <template v-for="(page, index) in items">
                            <PaginationListItem
                                v-if="page.type === 'page'"
                                :value="page.value"
                                :key="index"
                                class="ui-pagination__page"
                            >
                                {{ page.value }}
                            </PaginationListItem>
                            <PaginationEllipsis
                                v-else
                                :key="page.type"
                                :index="index"
                                >&#8230;</PaginationEllipsis
                            >
                        </template>
                        <PaginationNext asChild v-show="page !== pageCount">
                            <button
                                class="ui-pagination__button button-link"
                                data-size="small"
                                data-style="primary"
                                @click="scrollToTop"
                            >
                                Next
                            </button>
                        </PaginationNext>
                    </PaginationList>
                </PaginationRoot>
            </div>
        </div>
    </div>
</template>
