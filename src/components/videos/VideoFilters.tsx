import type { Signal } from '@preact/signals';
import type { PersonSpeaker } from '@content/schemaFragments/sanityComponents';
import type { VideoEventFilter } from '@content/videos';
import { useComputed, useSignal } from '@preact/signals';
import { useEffect, useRef } from 'preact/hooks';
// import Choices from 'choices.js';

/* TODO: Dynamically filter the filter lists based on selection */

declare namespace JSX {
    interface IntrinsicElements {
        'sl-select': any;
        'sl-option': any;
    }
}

type Props = {
    sortTerm: Signal<string>;
    sortDir: Signal<string>;
    eventFilter: Signal<string>;
    speakerFilter: Signal<string>;
    events: VideoEventFilter[];
    speakers: PersonSpeaker[];
    choicesTest: Signal<string>;
};

export default function VideoFilters({
    events,
    speakers,
    eventFilter,
    speakerFilter,
    sortTerm,
    sortDir,
    choicesTest,
}: Props) {
    // useEffect(() => {
    //     const speakersRef = document.querySelector('#filterSpeakerTest');
    //     const choices = new Choices(speakersRef!, {
    //         placeholderValue: 'Select speaker',
    //         shouldSort: false,
    //         itemSelectText: '',
    //         // removeItemButton: true,
    //         searchFields: ['label'],
    //         searchPlaceholderValue: 'Type to search',
    //         searchResultLimit: 3,
    //     });

    //     choices.setChoices(
    //         speakers.map((speaker) => ({
    //             value: speaker._id,
    //             label: speaker.title,
    //             selected: false,
    //             disabled: false,
    //         })),
    //     );

    //     speakersRef?.addEventListener('change', (e) => {
    //         // @ts-ignore
    //         choicesTest.value = e.detail.value;
    //     });
    // }, []);

    function handleReset() {
        // reset signals to default values
        sortTerm.value = 'date';
        sortDir.value = 'desc';
        eventFilter.value = 'all';
        speakerFilter.value = 'all';
        // choicesTest.value = '';

        // update choices
        // choices.clearChoices();
    }

    const showReset = useComputed(() => {
        let show = true;
        if (
            sortTerm.value == 'date' &&
            sortDir.value == 'desc' &&
            eventFilter.value == 'all' &&
            speakerFilter.value == 'all'
            // choicesTest.value == ''
        ) {
            show = false;
        }
        return show;
    });

    // filter down the events filter based on which speaker is selected
    const filteredEventsList = useComputed(() => {
        let list: VideoEventFilter[];

        if (speakerFilter.value != 'all') {
            const associatedSpeaker = speakers.find(
                (item) => item._id == speakerFilter.value,
            );

            if (associatedSpeaker && associatedSpeaker.associatedEvents) {
                list = events.filter(
                    (item) =>
                        associatedSpeaker.associatedEvents?.length &&
                        associatedSpeaker.associatedEvents.includes(item._id),
                );
            } else {
                list = [...events];
            }
        } else {
            list = [...events];
        }

        return list;
    });

    // filter down the speakers filter based on which event is selected
    const filteredSpeakersList = useComputed(() => {
        let list: PersonSpeaker[];

        if (eventFilter.value != 'all') {
            const associatedEvent = events.find(
                (item) => item._id == eventFilter.value,
            );

            if (associatedEvent && associatedEvent.associatedSpeakers) {
                list = speakers.filter(
                    (item) =>
                        associatedEvent.associatedSpeakers?.length &&
                        associatedEvent.associatedSpeakers.includes(item._id),
                );
            } else {
                list = [...speakers];
            }
        } else {
            list = [...speakers];
        }

        return list;
    });

    // const filteredEventsList = useComputed(() => {

    // })

    return (
        <div class="filters">
            <div class="filter-group">
                <sl-select
                    name="sort"
                    id="sort"
                    value={`${sortTerm.value}-${sortDir.value}`}
                    label="Sort"
                    size="medium"
                >
                    <sl-option value="date-desc">
                        Date, Newest to Oldest
                    </sl-option>
                    <sl-option value="date-asc">
                        Date, Oldest to Newest
                    </sl-option>
                    <sl-option value="title-asc">Title, A to Z</sl-option>
                    {/* <sl-option value="title-desc">Title, Z to A</sl-option> */}
                </sl-select>
            </div>
            <div class="filter-group">
                <sl-select
                    name="filterEvent"
                    id="filterEvent"
                    value={eventFilter.value}
                    label="Filter Event"
                    placeholder="Select Event"
                    size="medium"
                >
                    <sl-option value="all">All Events</sl-option>
                    {filteredEventsList.value.map((event) => (
                        <sl-option value={event._id}>{event.title}</sl-option>
                    ))}
                </sl-select>
            </div>
            <div class="filter-group">
                <sl-select
                    name="filterSpeaker"
                    id="filterSpeaker"
                    value={speakerFilter.value}
                    label="Filter Speaker"
                    placeholder="Select Speaker"
                    size="medium"
                >
                    <sl-option value="all">All Speakers</sl-option>
                    {filteredSpeakersList.value.map((speaker) => (
                        <sl-option value={speaker._id}>
                            {speaker.title}
                        </sl-option>
                    ))}
                </sl-select>
            </div>
            {/* <div class="filter-group">
                <select id="filterSpeakerTest" name="filterSpeakerTest">
                    <option value="">Select speaker</option>
                </select>
            </div> */}
            {showReset.value == true && (
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
