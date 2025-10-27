<script setup lang="ts">
import type { PersonSpeaker } from '@content/schemaFragments/sanityComponents';
import type { VideoEventFilter } from '@content/videos';
import {
    ComboboxRoot,
    ComboboxAnchor,
    ComboboxInput,
    ComboboxTrigger,
    ComboboxContent,
    ComboboxViewport,
    ComboboxEmpty,
    ComboboxItem,
    ComboboxItemIndicator,
    Label,
} from 'reka-ui';

/** Overlap of PersonSpeaker and VideoEventFilter fields */
type Filter = {
    _id: string;
    _type: 'personSpeaker' | 'event' | 'eventCategory';
    title: string;
};

interface Props {
    title?: string;
    name: string;
    filter?: Filter; // currently selected filter value(s)
    options: PersonSpeaker[] | VideoEventFilter[]; // all option values
}

defineProps<Props>();
defineEmits(['updateFilter']);
</script>

<template>
    <div class="filter-item">
        <Label class="ui__label" :for="name">{{ title ?? 'Filter by' }}</Label>
        <combobox-root
            class="ui-combobox__root"
            :name="name"
            :model-value="filter"
            @update:model-value="(v) => $emit('updateFilter', v)"
        >
            <combobox-anchor class="ui-combobox__anchor">
                <combobox-input
                    class="ui-combobox__input"
                    :id="name"
                    placeholder="Select..."
                    :display-value="(v: Filter) => v?.title"
                />
                <combobox-trigger class="ui-combobox__trigger">
                    <svg
                        class="ucla-icon__chevron-down"
                        aria-hidden="true"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M18 9.41L16.59 8L12 12.58L7.41 8L6 9.41L12 15.41L18 9.41Z"
                        />
                    </svg>
                </combobox-trigger>
            </combobox-anchor>
            <combobox-content class="ui-combobox__content">
                <combobox-viewport class="ui-combobox__viewport">
                    <combobox-empty />
                    <combobox-item
                        v-for="option in options"
                        :key="option._id"
                        :value="option"
                        :text-value="option.title"
                        class="ui-combobox__item"
                    >
                        {{ option.title }}
                    </combobox-item>
                </combobox-viewport>
            </combobox-content>
        </combobox-root>
    </div>
</template>
