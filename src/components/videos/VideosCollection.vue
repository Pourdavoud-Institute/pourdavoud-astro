<script setup lang="ts">
import type { CollectionEntry } from 'astro:content';
import type { VideoEventFilter } from '@content/videos';
import type { PersonSpeaker } from '@content/schemaFragments/sanityComponents';
import { ref, computed, onMounted, watchEffect } from 'vue';
import {
    PaginationEllipsis,
    PaginationList,
    PaginationListItem,
    PaginationNext,
    PaginationPrev,
    PaginationRoot,
} from 'reka-ui';
import VideoSort, {
    type SortTerm,
    type SortOptions,
} from './filterControls/VideoSort.vue';
import VideoFilter from './filterControls/VideoFilter.vue';
import VideoSearch from './filterControls/VideoSearch.vue';
import VideoView, { type ViewOptions } from './filterControls/VideoView.vue';
import VideoPreviewGrid from './views/VideoPreviewGrid.vue';
import VideoPreviewList from './views/VideoPreviewList.vue';
import { videoSearchParams as vParams } from '@lib/utils/videos';
import v from 'voca';

/** Props - from Astro */
interface Props {
    videos: CollectionEntry<'videos'>[];
    events: VideoEventFilter[];
    speakers: PersonSpeaker[];
}

const props = defineProps<Props>();

/** Constants / Defaults */
const DEFAULT_SORT: SortOptions = 'dateDesc';
const DEFAULT_VIEW: ViewOptions = 'list';
const PAGE_OFFSET = 30;
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

/** Refs */
// filter and sort refs
const sort = ref<SortOptions>(DEFAULT_SORT);
const searchFilter = ref<string>(''); // query string
const eventFilter = ref<VideoEventFilter>();
const speakerFilter = ref<PersonSpeaker>();
// pagination refs
const currentPage = ref<number>(1);
const pageOffset = ref<number>(PAGE_OFFSET);
// view refs
const view = ref<ViewOptions>(DEFAULT_VIEW);

/** Initialize / Mount */
// note: component must be mounted to access browser APIs like `window`
onMounted(() => {
    // run once when page loaded/component mounted
    // check for existing query params in URL when page is navigated to
    let params = new URLSearchParams(window.location.search);
    if (params.size) {
        // get param keys by dictionary lookup
        const sortParam = params.get(vParams.sort);
        const searchParam = params.get(vParams.search);
        const eventParam = params.get(vParams.event);
        const speakerParam = params.get(vParams.speaker);
        const viewParam = params.get(vParams.view);
        const paginateParam = params.get(vParams.paginate);

        // set params: set from existing params, validate against acceptable values
        // sort - validate existing SortOption
        if (sortParam && sortTerms.some((t) => t.value === sortParam)) {
            sort.value = sortParam as SortOptions;
        } else {
            // fallback to default if malformed params
            sort.value = 'dateDesc';
        }
        // search filter
        if (searchParam) {
            searchFilter.value = searchParam ?? '';
        }
        // event filter - validate existing event
        if (eventParam && props.events.some((e) => e._id === eventParam)) {
            // look up event from id
            const event = props.events.find((e) => e._id === eventParam);
            eventFilter.value = event;
        } else {
            // fallback to default if malformed params
            eventFilter.value = undefined;
        }
        // speaker filter - validate existing speaker
        if (
            speakerParam &&
            props.speakers.some((p) => p._id === speakerParam)
        ) {
            const speaker = props.speakers.find((p) => p._id === speakerParam);
            speakerFilter.value = speaker;
        } else {
            // fallback to default if malformed params
            speakerFilter.value = undefined;
        }
        // view - validate options
        if (viewParam && ['grid', 'list'].includes(viewParam)) {
            view.value = viewParam as ViewOptions;
        } else {
            // fallback to default if malformed params
            view.value = DEFAULT_VIEW;
        }
        if (paginateParam && !Number.isNaN(Number(paginateParam))) {
            // paginate - validate page - test if coerced value is a number or NaN
            // calculate current page from offset
            const offset = Number(paginateParam);
            currentPage.value = Math.round(offset / pageOffset.value) + 1;
        } else {
            // fallback to first page if malformed params
            currentPage.value = 1;
        }
    }

    // listen for ref updates after mount
    // set params: set new search params when refs change
    watchEffect(() => {
        // get current url and params
        const url = new URL(window.location.href);
        const params = url.searchParams;

        // reset all existing params & add/update new
        // sort
        params.set(vParams.sort, sort.value);
        // search
        if (searchFilter.value) {
            params.set(vParams.search, searchFilter.value);
        } else {
            params.delete(vParams.search);
        }
        // event filter
        if (eventFilter.value) {
            params.set(vParams.event, eventFilter.value._id);
        } else {
            params.delete(vParams.event);
        }
        // speaker filter
        if (speakerFilter.value) {
            params.set(vParams.speaker, speakerFilter.value._id);
        } else {
            params.delete(vParams.speaker);
        }
        // view
        params.set(vParams.view, view.value);
        // paginate
        if (currentPage.value > 1) {
            params.set(
                vParams.paginate,
                `${(currentPage.value - 1) * pageOffset.value}`,
            );
        } else {
            params.delete(vParams.paginate);
        }

        // replace state in URL
        window.history.replaceState({}, '', url.toString());
    });
});

/** Filters */
// filter video list
const filteredList = computed(() => {
    let list = props.videos;

    // filter list on search query value
    if (searchFilter.value) {
        // when a search value is present, reset pagination to 1
        currentPage.value = 1;
        // standardize input for search term
        const searchTerm = v
            .chain(searchFilter.value)
            .lowerCase()
            .latinise()
            .value();

        // use voca to standardize input against video titles & search terms
        // todo: extract into helper function for cleaner code?
        // todo: find better search algorithm that can search title & speaker at same time,
        // i.e., 'stevens persian'?
        // @link https://www.fusejs.io/
        list = list.filter((item) => {
            // filter search by video title
            if (
                v.includes(
                    v.chain(item.data.title).lowerCase().latinise().value(),
                    searchTerm,
                )
            ) {
                return true;
            }
            // don't include events in search filter -- too confusing
            if (item.data.speakersRef.length > 0) {
                // filter search by speaker(s)
                let foundSpeaker = false;
                item.data.speakersRef.forEach((s) => {
                    if (
                        v.includes(
                            v.chain(s.title).lowerCase().latinise().value(),
                            searchTerm,
                        )
                    ) {
                        foundSpeaker = true;
                    }
                });
                return foundSpeaker;
            }
            return false;
        });
    }

    // filter list on selected event
    if (eventFilter.value) {
        // when an event filter value is present, reset pagination to 1
        currentPage.value = 1;

        list = list.filter(
            (item) =>
                item.data.eventFiltersRef.length > 0 &&
                item.data.eventFiltersRef[0]._id === eventFilter.value?._id,
        );
    }

    // filter list on selected speaker
    if (speakerFilter.value) {
        // when a speaker filter value is present, reset pagination to 1
        currentPage.value = 1;

        list = list.filter(
            (item) =>
                item.data.speakersRef.length > 0 &&
                item.data.speakersRef[0]._id === speakerFilter.value?._id,
        );
    }

    return list;
});

// text description for video count, search term, and pagination
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

    const totalPages = Math.floor(videoCount.value / pageOffset.value) + 1;
    message += `, page ${currentPage.value} of ${totalPages}`;

    return message;
});

/** Sort */
// sort videos
const sortedList = computed(() => {
    // make copy of array because sort alters existing array in place
    // start with filtered list
    const list = [...filteredList.value];

    // sort by date
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

    // sort by title
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

/** Pagination */
// paginate video list using offsets
// note: this is the final list rendered in template
const paginatedList = computed(() => {
    // start from 0 so that page 2 is offset=30
    const offset = (currentPage.value - 1) * pageOffset.value;
    return sortedList.value.slice(offset, offset + pageOffset.value);
});

// count filtered videos
const videoCount = computed(() => {
    return filteredList.value.length;
});

/** Select Options Filters */
// filter events filter list based on which speaker is selected
const filteredEventOptions = computed(() => {
    let list = props.events;

    // get the associated speaker object when filter ref is set
    if (speakerFilter.value) {
        const associatedSpeaker = props.speakers.find(
            (item) => item._id === speakerFilter.value?._id,
        );

        // check assoc. speaker's attached event refs
        if (associatedSpeaker && associatedSpeaker.associatedEvents) {
            list = props.events.filter(
                (item) =>
                    associatedSpeaker.associatedEvents?.length &&
                    associatedSpeaker.associatedEvents.includes(item._id),
            );
        }
    }

    return list;
});

// filter speakers filter list based on which event is selected
const filteredSpeakerOptions = computed(() => {
    let list = props.speakers;

    // get associated event object when filter ref is set
    if (eventFilter.value) {
        const associatedEvent = props.events.find(
            (item) => item._id === eventFilter.value?._id,
        );

        // check assoc. event's attached speaker refs
        if (associatedEvent && associatedEvent.associatedSpeakers) {
            list = props.speakers.filter(
                (item) =>
                    associatedEvent.associatedSpeakers?.length &&
                    associatedEvent.associatedSpeakers.includes(item._id),
            );
        }
    }

    return list;
});

/** Buttons / Clear Filters */
// clear all filters
const showClearFilters = computed(() => {
    let show = false;
    // show if not default sort or search term present
    if (sort.value !== DEFAULT_SORT || searchFilter.value) {
        show = true;
    }

    // show if both main filters are on (hide if only one)
    if (eventFilter.value && speakerFilter.value) {
        show = true;
    }

    return show;
});

// clear speaker filter
const showClearSpeakerFilter = computed(() => {
    return speakerFilter.value ? true : false;
});

// clear event filter
const showClearEventFilter = computed(() => {
    return eventFilter.value ? true : false;
});

/** Helpers */
// reset the search filter and paginated list when input is cleared
function clearSearch() {
    searchFilter.value = '';
    currentPage.value = 1;
}

// reset all filters & search values
function clearFilters() {
    clearSearch();
    sort.value = DEFAULT_SORT;
    eventFilter.value = undefined;
    speakerFilter.value = undefined;
}

// scroll to top of pagination container
function scrollToTop(e: PointerEvent) {
    const container = document.querySelector('#videos-index');
    container?.scrollIntoView({ behavior: 'smooth' });
}
</script>

<template>
    <div class="filters-panel | flow" data-tempo="vivace">
        <!-- <div class="small-title">Filters</div> -->
        <div class="cluster">
            <video-search
                :search="searchFilter"
                @update-search="(v) => (searchFilter = v)"
                @clear-search="clearSearch"
            />
            <video-filter
                title="Filter by Speaker"
                name="speakerFilter"
                :filter="speakerFilter"
                :options="filteredSpeakerOptions"
                @update-filter="(v) => (speakerFilter = v)"
            />
            <video-filter
                title="Filter by Event"
                name="eventFilter"
                :filter="eventFilter"
                :options="filteredEventOptions"
                @update-filter="(v) => (eventFilter = v)"
            />
            <video-sort
                :sort="sort"
                :sort-terms="sortTerms"
                @update-sort="(v) => (sort = v)"
            />
        </div>
        <div class="clear-filters | cluster">
            <button
                v-if="showClearSpeakerFilter"
                class="button-link with-icon"
                data-style="primary"
                data-size="small"
                @click="() => (speakerFilter = undefined)"
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
                <span>{{ speakerFilter?.title }}</span>
            </button>
            <button
                v-if="showClearEventFilter"
                class="button-link with-icon"
                data-style="primary"
                data-size="small"
                @click="() => (eventFilter = undefined)"
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
                <span>{{ eventFilter?.title }}</span>
            </button>
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
        <div
            class="list-info | cluster"
            :class="{ contained: view === 'list' }"
        >
            <p class="filter-description">
                <em>{{ filterDescription }}</em>
            </p>
            <video-view :view="view" @update-view="(v) => (view = v)" />
        </div>
        <div class="videos-list-wrapper">
            <ul class="videos-list" :class="{ 'fluid-grid': view === 'grid' }">
                <li v-for="video in paginatedList" :key="video.id">
                    <video-preview-grid v-if="view === 'grid'" :video="video" />
                    <video-preview-list v-else :video="video" />
                </li>
            </ul>
            <pagination-root
                class="ui-pagination__root"
                v-model:page="currentPage"
                :total="videoCount"
                :items-per-page="pageOffset"
                :show-edges="true"
                v-slot="{ page, pageCount }"
                @update:page="(v) => console.log(`current page: ${v}`)"
            >
                <pagination-list
                    class="ui-pagination__list | cluster"
                    v-slot="{ items }"
                >
                    <pagination-prev asChild v-show="page !== 1">
                        <button
                            class="ui-pagination__button | button-link with-icon"
                            data-size="small"
                            data-style="primary-ghost"
                            @click="scrollToTop"
                        >
                            <svg
                                aria-hidden="true"
                                class="ucla-icon__chevron-left"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M14 18L15.41 16.59L10.83 12L15.41 7.41L14 6L8 12L14 18Z"
                                />
                            </svg>
                            <span>Prev</span>
                        </button>
                    </pagination-prev>
                    <template v-for="(page, index) in items">
                        <pagination-list-item
                            v-if="page.type === 'page'"
                            :value="page.value"
                            :key="index"
                            class="ui-pagination__page"
                        >
                            {{ page.value }}
                        </pagination-list-item>
                        <pagination-ellipsis
                            v-else
                            :key="page.type"
                            :index="index"
                            >&#8230;</pagination-ellipsis
                        >
                    </template>
                    <pagination-next asChild v-show="page !== pageCount">
                        <button
                            class="ui-pagination__button | button-link with-icon"
                            data-size="small"
                            data-style="primary-ghost"
                            @click="scrollToTop"
                        >
                            <span>Next</span>
                            <svg
                                aria-hidden="true"
                                class="ucla-icon__chevron-right"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M9.41 6L8 7.41L12.58 12L8 16.59L9.41 18L15.41 12L9.41 6Z"
                                />
                            </svg>
                        </button>
                    </pagination-next>
                </pagination-list>
            </pagination-root>
            <div class="space-m-top center-all">
                <a href="#videos-index" style="text-align: center"
                    >Back to Top</a
                >
            </div>
        </div>
    </div>
</template>
