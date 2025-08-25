import { useComputed, useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
// import type { JSX } from 'preact';
import type { CollectionEntry } from 'astro:content';
import VideoPreview from './VideoPreview';
import VideoFilters from './VideoFilters';
import type { PersonSpeaker } from '@content/schemaFragments/sanityComponents';
import type { VideoEventFilter } from '@content/videos';

type Props = {
    videos: CollectionEntry<'videos'>[];
    events: VideoEventFilter[];
    speakers: PersonSpeaker[];
};

export default function VideoCollection({ videos, events, speakers }: Props) {
    const sortTerm = useSignal('date');
    const sortDir = useSignal('desc'); // A-Z
    const eventFilter = useSignal('all'); // uses id from referenceFilter as key
    const speakerFilter = useSignal('all');
    const choicesTest = useSignal('');

    // listen for shoelace component changes
    useEffect(() => {
        const sortSelect = document.querySelector('#sort');
        sortSelect?.addEventListener('sl-change', (e) => {
            // @ts-expect-error
            const [term, dir] = e.target.value.split('-');
            sortTerm.value = term;
            sortDir.value = dir;
        });

        const filterEvent = document.querySelector('#filterEvent');
        filterEvent?.addEventListener('sl-change', (e) => {
            // @ts-expect-error
            eventFilter.value = e.target.value;
        });

        const filterSpeaker = document.querySelector('#filterSpeaker');
        filterSpeaker?.addEventListener('sl-change', (e) => {
            // @ts-expect-error
            speakerFilter.value = e.target.value;
        });
    });

    // function handleSort(event: JSX.TargetedEvent<HTMLSelectElement, Event>) {
    //     const [term, dir] = event.currentTarget.value.split('-');
    //     sortTerm.value = term;
    //     sortDir.value = dir;
    // }

    // function handleFilterEvent(
    //     event: JSX.TargetedEvent<HTMLSelectElement, Event>,
    // ) {
    //     eventFilter.value = event.currentTarget.value;
    // }

    const filteredSortedVideoList = useComputed(() => {
        // set var but don't initialize: this is bc filter() returns a shallow copy,
        // whereas sort() alters in-place
        let list: CollectionEntry<'videos'>[];
        // filter
        if (eventFilter.value != 'all' && speakerFilter.value != 'all') {
            list = videos
                .filter((item) => {
                    return (
                        item.data.eventFiltersRef.length > 0 &&
                        item.data.eventFiltersRef[0]._id == eventFilter.value
                    );
                })
                .filter((item) => {
                    return (
                        item.data.speakersRef.length > 0 &&
                        item.data.speakersRef.some(
                            (speaker) => speaker._id == speakerFilter.value,
                        )
                    );
                });
        } else if (eventFilter.value != 'all') {
            list = videos.filter((item) => {
                return (
                    item.data.eventFiltersRef.length > 0 &&
                    item.data.eventFiltersRef[0]._id == eventFilter.value
                );
            });
        } else if (speakerFilter.value != 'all') {
            list = videos.filter((item) => {
                return (
                    item.data.speakersRef.length > 0 &&
                    item.data.speakersRef.some(
                        (speaker) => speaker._id == speakerFilter.value,
                    )
                );
            });
        } else {
            // copy videos into new arr
            list = [...videos];
        }

        // sort
        if (sortTerm.value == 'title') {
            list.sort((a, b) => {
                if (a.data.title < b.data.title) {
                    return sortDir.value == 'asc' ? -1 : 1;
                }
                if (a.data.title > b.data.title) {
                    return sortDir.value == 'asc' ? 1 : -1;
                }
                return 0;
            });
        } else if (sortTerm.value == 'date') {
            list.sort((a, b) => {
                const dateA = new Date(a.data.date);
                const dateB = new Date(b.data.date);

                if (sortDir.value == 'desc') {
                    // latest to earliest
                    return (dateB as any) - (dateA as any);
                } else {
                    return (dateA as any) - (dateB as any);
                }
            });
        }
        return list;
    });

    const videoCount = useComputed(() => {
        return filteredSortedVideoList.value.length;
    });

    const filterDescription = useComputed(() => {
        // sort
        // let direction = '';
        // if (sortDir.value == 'desc') {
        //     if (sortTerm.value == 'date') {
        //         direction = 'Most Recent to Oldest';
        //     } else {
        //         direction = 'Z to A';
        //     }
        // } else {
        //     if (sortTerm.value == 'date') {
        //         direction = 'Oldest to Most Recent';
        //     } else {
        //         direction = 'A to Z';
        //     }
        // }

        // filters lookup
        let event: VideoEventFilter | undefined;
        let speaker: PersonSpeaker | undefined;
        if (eventFilter.value != 'all') {
            event = events.find((e) => e._id == eventFilter.value);
        }
        if (speakerFilter.value != 'all') {
            speaker = speakers.find((s) => s._id == speakerFilter.value);
        }

        // let message = `Showing ${videoCount.value} videos sorted by <strong>${voca.capitalize(sortTerm.value)}</strong>, ${direction}`;
        let message = '';
        if (videoCount.value == 1) {
            message = `Showing ${videoCount.value} video`;
        } else {
            message = `Showing ${videoCount.value} videos`;
        }

        if (event != undefined && speaker != undefined) {
            message += `, filtered by <strong>${event.title}</strong> & <strong>${speaker.title}</strong>`;
        } else if (event != undefined) {
            message += `, filtered by <strong>${event.title}</strong>`;
        } else if (speaker != undefined) {
            message += `, filtered by <strong>${speaker.title}</strong>`;
        }

        return message;
    });

    return (
        <div class="with-sidebar">
            <div class="sidebar-panel | flow" data-tempo="andante">
                <VideoFilters
                    events={events}
                    speakers={speakers}
                    eventFilter={eventFilter}
                    speakerFilter={speakerFilter}
                    sortDir={sortDir}
                    sortTerm={sortTerm}
                    choicesTest={choicesTest}
                />

                <a class="back-to-top with-icon" href="#videos-index">
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M11 20L11 7.825L5.4 13.425L4 12L12 4L20 12L18.6 13.425L13 7.825L13 20L11 20Z" />
                    </svg>
                    <span>Back to Top</span>
                </a>
            </div>
            <div class="main-panel">
                <p
                    dangerouslySetInnerHTML={{
                        __html: filterDescription.value,
                    }}
                />
                <div class="videos-list">
                    {filteredSortedVideoList.value.map((video) => (
                        <VideoPreview video={video} />
                    ))}
                </div>
            </div>
        </div>
    );
}
