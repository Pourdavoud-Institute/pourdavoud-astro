<script setup lang="ts">
import type { CollectionEntry } from 'astro:content';
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
} from 'reka-ui';
import VideoSort, {
    type SortTerm,
    type SortOptions,
} from './filterControls/VideoSort.vue';
import VideoSearch from './filterControls/VideoSearch.vue';
import v from 'voca';

interface Props {
    videos: CollectionEntry<'videos'>[];
}

const props = defineProps<Props>();

const sort = ref<SortOptions>('dateDesc');
const searchFilter = ref<string>('');
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
    // check for existing params in url
    let params = new URLSearchParams(window.location.search);
    if (params.size) {
        // get param keys
        const sortParam = params.get('sort');
        const searchParam = params.get('q');
        // set params, validate against acceptable values
        if (sortParam && sortTerms.some((t) => t.value === sortParam)) {
            sort.value = sortParam as SortOptions;
        } else {
            // fallback to default if malformed params
            sort.value = 'dateDesc';
        }
        if (searchParam) {
            searchFilter.value = searchParam ?? '';
        }
    }

    // set params when refs change
    watchEffect(() => {
        // get current url and params
        const url = new URL(window.location.href);
        // reset existing params
        const params = url.searchParams;
        params.set('sort', sort.value);
        if (searchFilter.value) {
            params.set('q', searchFilter.value);
        } else {
            params.delete('q');
        }

        // push state
        window.history.replaceState({}, '', url.toString());
    });
});

const filteredList = computed(() => {
    if (searchFilter.value) {
        // when search value is present, reset pagination to 1
        currentPage.value = 1;
        // console.log(searchFilter.value);
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
</script>

<template>
    <div>
        <div class="filters-panel">
            <div class="cluster">
                <VideoSearch
                    :search="searchFilter"
                    @update-search="(v) => (searchFilter = v)"
                    @clear-search="searchFilter = ''"
                />
                <VideoSort
                    :sort="sort"
                    :sort-terms="sortTerms"
                    @update-sort="(v) => (sort = v)"
                />
            </div>
        </div>
        <div class="main-panel">
            <div>
                <em>{{ filterDescription }}</em>
            </div>
            <div class="videos-list">
                <p>current page: {{ currentPage }}</p>
                <ul class="videos-list">
                    <li v-for="(video, index) in paginatedList" :key="video.id">
                        <p>{{ index + 1 }}</p>
                        <p>
                            <strong>{{ video.data.title }}</strong>
                        </p>
                        <p>{{ video.data.date }}</p>
                    </li>
                </ul>
                <PaginationRoot
                    v-model:page="currentPage"
                    :total="videoCount"
                    :items-per-page="pageOffset"
                    :show-edges="true"
                    @update:page="(v) => console.log(`current page: ${v}`)"
                >
                    <PaginationList v-slot="{ items }">
                        <PaginationFirst />
                        <PaginationPrev />
                        <template v-for="(page, index) in items" :key="index">
                            <PaginationListItem
                                v-if="page.type === 'page'"
                                :value="page.value"
                            >
                                <div>
                                    <p>
                                        <strong>{{ page.value }}</strong>
                                    </p>
                                    <!-- <p>{{ page.data.date }}</p> -->
                                </div>
                            </PaginationListItem>
                            <PaginationEllipsis v-else
                                >&#8230;</PaginationEllipsis
                            >
                        </template>
                        <PaginationNext />
                        <PaginationLast />
                    </PaginationList>
                </PaginationRoot>
            </div>
        </div>
    </div>
</template>
