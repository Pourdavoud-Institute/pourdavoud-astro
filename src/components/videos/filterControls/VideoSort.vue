<script setup lang="ts">
import {
    SelectRoot,
    SelectTrigger,
    SelectValue,
    SelectPortal,
    SelectContent,
    SelectViewport,
    SelectItem,
    SelectItemIndicator,
    SelectItemText,
    Label,
    useForwardPropsEmits,
} from 'reka-ui';

/** NOTE: Use Reka UI's controlled state so that parent component (VideosCollection) can control the state of sort terms. This requires explicitly setting `:model-value` binding the and `@update:model-value` event listener on the component root, and in the callback emitting another event to the parent.
 * @link https://reka-ui.com/docs/guides/controlled-state#_1-forgetting-update-modelvalue
 * */

export type SortOptions = 'dateAsc' | 'dateDesc' | 'titleAsc' | 'titleDesc';
export type SortTerm = {
    text: string;
    value: SortOptions;
};

interface Props {
    sort: SortOptions;
    sortTerms: SortTerm[];
}

defineProps<Props>();
defineEmits(['updateSort']);
</script>

<template>
    <div class="filter-item">
        <Label class="ui__label" for="sort">Sort by</Label>
        <select-root
            :model-value="sort"
            @update:model-value="(v) => $emit('updateSort', v)"
        >
            <select-trigger
                id="sort"
                class="ui-select__trigger"
                aria-label="Sort list by term"
            >
                <select-value />
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
            </select-trigger>
            <SelectPortal>
                <SelectContent
                    class="ui-select__content"
                    position="item-aligned"
                    sticky="partial"
                >
                    <SelectViewport class="ui-select__viewport">
                        <SelectItem
                            v-for="(option, index) in sortTerms"
                            :key="index"
                            :value="option.value"
                            class="ui-select__item"
                        >
                            <SelectItemIndicator
                                class="ui-select__item_indicator"
                                asChild
                            >
                                <svg
                                    class="ucla-icon__check"
                                    aria-hidden="true"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M9.7 18.025L4 12.325L5.425 10.9L9.7 15.175L18.875 6L20.3 7.425L9.7 18.025Z"
                                    />
                                </svg>
                            </SelectItemIndicator>
                            <SelectItemText class="ui-select__item_text">{{
                                option.text
                            }}</SelectItemText>
                        </SelectItem>
                    </SelectViewport>
                </SelectContent>
            </SelectPortal>
        </select-root>
    </div>
</template>
