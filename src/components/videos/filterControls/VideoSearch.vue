<script setup lang="ts">
import { Label } from 'reka-ui';

/** todo: add debounce function for @keyup
 * @link https://www.joshwcomeau.com/snippets/javascript/debounce/
 *
 * todo: add button indicator and event for clearing search
 */

interface Props {
    search: string;
}

defineProps<Props>();
defineEmits(['updateSearch', 'clearSearch']);
</script>

<template>
    <div class="filter-item">
        <Label class="ui__label" for="search">Search</Label>
        <div class="ui-search__wrapper">
            <svg
                aria-hidden="true"
                class="ucla-icon__search"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M19.6 21L13.3 14.7C12.8 15.1 12.225 15.4167 11.575 15.65C10.925 15.8833 10.2333 16 9.5 16C7.68333 16 6.146 15.371 4.888 14.113C3.62933 12.8543 3 11.3167 3 9.5C3 7.68333 3.62933 6.14567 4.888 4.887C6.146 3.629 7.68333 3 9.5 3C11.3167 3 12.8543 3.629 14.113 4.887C15.371 6.14567 16 7.68333 16 9.5C16 10.2333 15.8833 10.925 15.65 11.575C15.4167 12.225 15.1 12.8 14.7 13.3L21 19.6L19.6 21ZM9.5 14C10.75 14 11.8127 13.5627 12.688 12.688C13.5627 11.8127 14 10.75 14 9.5C14 8.25 13.5627 7.18733 12.688 6.312C11.8127 5.43733 10.75 5 9.5 5C8.25 5 7.18733 5.43733 6.312 6.312C5.43733 7.18733 5 8.25 5 9.5C5 10.75 5.43733 11.8127 6.312 12.688C7.18733 13.5627 8.25 14 9.5 14Z"
                />
            </svg>
            <input
                id="search"
                type="text"
                class="ui-search__input"
                :value="search"
                placeholder="Search titles"
                @keyup="
                    (e) =>
                        $emit(
                            'updateSearch',
                            (e.target as HTMLInputElement)?.value,
                        )
                "
                @keyup.escape="$emit('clearSearch')"
            />
        </div>
    </div>
</template>
