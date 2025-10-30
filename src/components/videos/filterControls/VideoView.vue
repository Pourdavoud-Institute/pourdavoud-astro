<script setup lang="ts">
import { Label } from 'reka-ui';

export type ViewOptions = 'grid' | 'list';

interface Props {
    view: ViewOptions;
}

defineProps<Props>();
defineEmits(['updateView']);
</script>

<template>
    <div class="list-views | cluster">
        <Label class="ui__label" for="view-select">View as</Label>
        <div id="view-select" class="ui-toggle-group__root | cluster">
            <button
                class="ui-toggle-group__item | button-link with-icon"
                :data-style="view === 'list' ? 'primary' : 'primary-ghost'"
                data-size="small"
                @click="() => $emit('updateView', 'list')"
            >
                <svg
                    aria-hidden="true"
                    class="ucla-icon__menu"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M3 18V16H21V18H3ZM3 13V11H21V13H3ZM3 8V6H21V8H3Z"
                    />
                </svg>
                <span>List</span>
            </button>
            <button
                class="ui-toggle-group__item | button-link with-icon"
                :data-style="view === 'grid' ? 'primary' : 'primary-ghost'"
                data-size="small"
                @click="() => $emit('updateView', 'grid')"
            >
                <svg
                    aria-hidden="true"
                    class="ucla-icon__image-gallery"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M20 4V16H8V4H20ZM20 2H8C6.9 2 6 2.9 6 4V16C6 17.1 6.9 18 8 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM11.5 11.67L13.19 13.93L15.67 10.83L19 15H9L11.5 11.67ZM2 6V20C2 21.1 2.9 22 4 22H18V20H4V6H2Z"
                    />
                </svg>
                <span>Grid</span>
            </button>
        </div>
    </div>
</template>
