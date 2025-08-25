import { useComputed, useSignal, signal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import type { CollectionEntry } from 'astro:content';
import EventPreviewList from '@components/events/EventPreviewList';
import EventFilters from '@components/events/EventFilters';
import { isAfter, isBefore, sameDay, tzDate } from '@formkit/tempo';
import { key } from 'node_modules/astro-portabletext/lib/context';

type Props = {
    events: CollectionEntry<'events'>[];
    categories: CollectionEntry<'eventCategories'>[];
    url: URL;
};

export default function EventCollection({ events, categories, url }: Props) {
    const sortTerm = useSignal('date');
    const sortDir = useSignal('desc');
    const eventFilter = useSignal('upcoming');
    const categoriesFilter = useSignal(
        Object.fromEntries(categories.map((category) => [category.id, false])),
    );
    // const categoriesFilter = useSignal(
    //     new Map<string, boolean>(
    //         categories.map((category) => [category.id, false]),
    //     ),
    // );
    // console.log(categoriesFilter.value);

    // listen for shoelace component changes
    useEffect(() => {
        const params = url.searchParams;

        const filterEvent = document.querySelector('#filterEvent');
        filterEvent?.addEventListener('sl-change', (e) => {
            // @ts-expect-error
            eventFilter.value = e.target.value;

            if (eventFilter.value == 'upcoming') {
                params.set('filter', 'upcoming');
                window.history.pushState(null, '', url);
            } else {
                params.set('filter', 'past');
                window.history.pushState(null, '', url);
            }
        });

        const filterCategories = document.querySelectorAll(
            '#filterCategories sl-checkbox',
        );
        filterCategories?.forEach((checkbox) => {
            checkbox.addEventListener('sl-change', (e) => {
                // console.log(e.target.id, e.target.checked);

                // map
                const element = e.target as HTMLFormElement;
                if (element.checked) {
                    // categoriesFilter.value[element.id] = true;
                    categoriesFilter.value = {
                        ...categoriesFilter.value,
                        [element.id]: true,
                    };
                } else {
                    categoriesFilter.value = {
                        ...categoriesFilter.value,
                        [element.id]: false,
                    };
                }

                // categoriesFilter.value.map((filter) => {
                //     const linkedCategory = categories.find(
                //         (item) => item.id == filter,
                //     );
                //     let categorySlug = linkedCategory!.data.slug;
                //     if (categorySlug.startsWith('/')) {
                //         categorySlug = categorySlug.slice(
                //             1,
                //             categorySlug.length,
                //         );
                //     }
                //     if (value) {
                //         params.set(categorySlug, 'true');
                //     } else {
                //         params.delete(categorySlug);
                //     }

                //     window.history.pushState(null, '', url);
                // });
                // categoriesFilter.value = [...categoriesFilter.value]
                // console.log(categoriesFilter.value);
            });
        });
    });

    const shouldFilterCategories = useComputed(() => {
        let shouldFilter = false;
        for (const [_key, value] of Object.entries(categoriesFilter.value)) {
            if (value) {
                shouldFilter = true;
            }
        }
        return shouldFilter;
    });

    const filteredSortedEventList = useComputed(() => {
        let list: CollectionEntry<'events'>[] = [];

        // for (let i = 0; i < events.length; i++) {
        //     const event = events[i];
        //     const now = new Date();

        //     // date filter
        //     if (eventFilter.value == 'upcoming') {
        //         if (
        //             sameDay(
        //                 tzDate(
        //                     event.data.details.startDate,
        //                     'America/Los_Angeles',
        //                 ),
        //                 now,
        //             ) ||
        //             isAfter(event.data.details.startDate, now)
        //         ) {
        //             // console.log(event.data.categories);
        //             // if (event.data.categories.some())
        //             let isFiltered = false;
        //             for (let j = 0; j < event.data.categories.length; j++) {
        //                 const category = event.data.categories[j];
        //                 console.log(category);
        //                 console.log(categoriesFilter.value);
        //                 if (categoriesFilter.value.get(category['_id'])) {
        //                     console.log('filtered');
        //                     isFiltered = true;
        //                 }
        //             }

        //             if (isFiltered) {
        //                 list.push(event);
        //             }
        //         }
        //     } else {
        //         if (isBefore(event.data.details.startDate, now)) {
        //             list.push(event);
        //         }
        //     }

        // category filters
        // }
        // filter on date
        if (eventFilter.value == 'upcoming') {
            list = events.filter((item) => {
                const now = new Date();
                return (
                    sameDay(
                        tzDate(
                            item.data.details.startDate,
                            'America/Los_Angeles',
                        ),
                        now,
                    ) || isAfter(item.data.details.startDate, now)
                );
            });
        } else if (eventFilter.value == 'past') {
            list = events.filter((item) => {
                const now = new Date();
                return isBefore(item.data.details.startDate, now);
            });
        } else {
            list = [...events];
        }

        // filter on categories map
        if (shouldFilterCategories.value) {
            list = list.filter((item) => {
                let isFiltered = false;
                for (let i = 0; i < item.data.categories.length; i++) {
                    const category = item.data.categories[i];
                    if (categoriesFilter.value[category._id] == true) {
                        isFiltered = true;
                    }
                }
                return isFiltered;
            });
        }
        // list = list.filter((item) => {

        // })

        // list = [
        //     ...list.filter((item) => {
        //         for (let i = 0; i < item.data.categories.length; i++) {
        //             const category = item.data.categories[i];
        //             if (categoriesFilter.value.includes(category._id)) {
        //                 return true;
        //             }
        //         }
        //         return false;
        //         // const
        //         // if (item.data.categories.length > 0) {
        //         //     const itemCategory = item.data.categories[0]._id;
        //         //     console.log(itemCategory);
        //         //     const isFiltered = categoriesFilter.value.get(itemCategory);
        //         //     return isFiltered;
        //         // }
        //     }),
        // ];

        // sort
        if (eventFilter.value == 'upcoming') {
            sortTerm.value = 'date';
            sortDir.value = 'asc';

            list.sort((a, b) => {
                const dateA = new Date(a.data.details.startDate);
                const dateB = new Date(b.data.details.startDate);
                // current to future
                return (dateA as any) - (dateB as any);
            });
        } else if (eventFilter.value == 'past') {
            sortTerm.value = 'date';
            sortDir.value = 'desc';

            list.sort((a, b) => {
                const dateA = new Date(a.data.details.startDate);
                const dateB = new Date(b.data.details.startDate);
                // recent to oldest
                return (dateB as any) - (dateA as any);
            });
        }

        return list;
    });

    const eventCount = useComputed(() => {
        return filteredSortedEventList.value.length;
    });

    const filterDescription = useComputed(() => {
        let message = '';
        if (eventCount.value == 1) {
            message = `Showing ${eventCount.value} event`;
        } else {
            message = `Showing ${eventCount.value} events`;
        }

        return message;
    });

    return (
        <div class="with-sidebar">
            <div class="sidebar-panel | flow" data-tempo="andante">
                <EventFilters
                    eventFilter={eventFilter}
                    categories={categories}
                    categoriesFilter={categoriesFilter}
                    shouldFilterCategories={shouldFilterCategories}
                    sortDir={sortDir}
                    sortTerm={sortTerm}
                />
                <a class="back-to-top" href="#events-index">
                    Top
                </a>
            </div>
            <div class="main-panel">
                <h2>
                    {eventFilter.value == 'upcoming'
                        ? 'Upcoming Events'
                        : 'Past Events'}
                </h2>
                <p
                    dangerouslySetInnerHTML={{
                        __html: filterDescription.value,
                    }}
                />
                <div class="event-list">
                    {filteredSortedEventList.value.map((event) => (
                        <EventPreviewList event={event} />
                    ))}
                </div>
            </div>
        </div>
    );
}
