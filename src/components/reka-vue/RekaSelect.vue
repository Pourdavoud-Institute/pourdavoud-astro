<script setup lang="ts">
import {
    SelectRoot,
    SelectContent,
    SelectItem,
    SelectPortal,
    SelectTrigger,
    SelectValue,
    SelectItemText,
    SelectViewport,
    Label,
} from 'reka-ui';

/** NOTE: Use Reka UI's controlled state so that parent components can control the state of active sort/filter terms. This requires explicitly setting `:model-value` binding the and `@update:model-value` event listener on the component root, and in the callback emitting another event to the parent.
 * @link https://reka-ui.com/docs/guides/controlled-state#_1-forgetting-update-modelvalue
 * */

interface Props {
    label?: string; // label title
    inputName: string; // input `name` attribute
    filterValue?: any; // currently selected filter value from parent ref
    selectOptions: {
        text: string;
        value: string | number;
    }[];
}

const {
    label = 'Filter by',
    inputName,
    filterValue,
    selectOptions,
} = defineProps<Props>();

defineEmits(['updateFilterValue']);
</script>

<template>
    <div class="filter-item">
        <Label class="ui__label" :for="inputName">{{ label }}</Label>
        <select-root
            class="ui-select__root"
            :id="inputName"
            :name="inputName"
            :model-value="filterValue"
            @update:model-value="(v) => $emit('updateFilterValue', v)"
        >
            <select-trigger
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
            <select-portal>
                <select-content
                    class="ui-select__content"
                    position="popper"
                    position-strategy="absolute"
                    :body-lock="false"
                >
                    <select-viewport class="ui-select__viewport">
                        <select-item
                            v-for="(option, index) in selectOptions"
                            :key="index"
                            :value="option.value"
                            class="ui-select__item"
                        >
                            <select-item-text class="ui-select__item_text">{{
                                option.text
                            }}</select-item-text>
                        </select-item>
                    </select-viewport>
                </select-content>
            </select-portal>
        </select-root>
    </div>
</template>
