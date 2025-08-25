import type { ReadonlySignal, Signal } from '@preact/signals';
import { useComputed } from '@preact/signals';
import type { EventCategory } from '@content/taxonomies';
import type { CollectionEntry } from 'astro:content';

type Props = {
    sortTerm: Signal<string>;
    sortDir: Signal<string>;
    eventFilter: Signal<string>;
    categories: CollectionEntry<'eventCategories'>[];
    categoriesFilter: Signal<{ [k: string]: boolean }>;
    shouldFilterCategories: ReadonlySignal<boolean>;
};

export default function EventFilters({
    sortTerm,
    sortDir,
    eventFilter,
    categories,
    categoriesFilter,
    shouldFilterCategories,
}: Props) {
    function handleReset() {
        // reset signals to default values
        // sortTerm.value = 'date';
        // sortDir.value = 'desc';
        // eventFilter.value = 'upcoming';

        const checkboxes = document.querySelectorAll(
            '#filterCategories sl-checkbox',
        );
        checkboxes.forEach(
            (category) => ((category as HTMLFormElement).checked = false),
        );

        categoriesFilter.value = Object.fromEntries(
            categories.map((category) => [category.id, false]),
        );
    }

    const showReset = useComputed(() => {
        return shouldFilterCategories.value;
        // const categories = document.querySelectorAll(
        //     '#filterCategories sl-checkbox',
        // );

        // if (
        //     Array.from(categories).some(
        //         (category) => (category as HTMLFormElement).checked,
        //     )
        // ) {
        //     return true;
        // }

        // return false;
    });

    return (
        <div class="filters">
            <div class="filter-group">
                <sl-radio-group
                    id="filterEvent"
                    label="Filter Events"
                    value={eventFilter.value}
                >
                    <sl-radio-button value="upcoming">Upcoming</sl-radio-button>
                    <sl-radio-button value="past">Past</sl-radio-button>
                </sl-radio-group>
            </div>
            <div class="filter-group">
                <p class="filter-label">Filter Categories</p>
                <div id="filterCategories" class="flow" data-tempo="vivace">
                    {categories.map((category) => (
                        <sl-checkbox id={category.id}>
                            {category.data.title}
                        </sl-checkbox>
                    ))}
                </div>
            </div>
            {showReset.value && (
                <button
                    class="button-link with-icon"
                    data-style="primary"
                    onClick={handleReset}
                    type="button"
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5Z" />
                    </svg>
                    Clear Filters
                </button>
            )}
        </div>
    );
}
