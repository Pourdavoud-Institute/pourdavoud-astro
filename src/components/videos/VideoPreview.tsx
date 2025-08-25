import getYouTubeID from 'get-youtube-id';
import type { CollectionEntry } from 'astro:content';
import { format } from '@formkit/tempo';

type Props = {
    video: CollectionEntry<'videos'>;
};

export default function VideoPreview({ video }: Props) {
    const ytID = getYouTubeID(video.data.url);
    // const filterKeys = [];
    // if (video.data.eventFiltersRef.length > 0) {
    //     filterKeys.push(video.data.eventFiltersRef[0]._id);
    // }
    // if (video.data.speakersRef.length > 0) {
    //     for (let i = 0; i < video.data.speakersRef.length; i++) {
    //         const speaker = video.data.speakersRef[i];
    //         filterKeys.push(speaker._id);
    //     }
    // }

    /*
        data-filter-keys={
        filterKeys.length > 0 ? filterKeys.join(',') : null
        }
    */

    return (
        <article class="video-preview" data-video-id={video.id}>
            <div class="text-wrapper | flow" data-tempo="allegro">
                <h2 class="title">
                    <a class="title-link" href={`/media${video.data.slug}`}>
                        {video.data.title}
                    </a>
                </h2>
                <div class="details">
                    {video.data.eventFiltersRef.length > 0 && (
                        <span>
                            <strong>
                                {video.data.eventFiltersRef[0].title}
                            </strong>
                        </span>
                    )}
                    <span>{format(video.data.date, 'MMM D, YYYY')}</span>
                </div>
                {video.data.speakersRef.length > 0 && (
                    <div class="speakers">
                        {video.data.speakersRef.map((speaker) => (
                            <p>
                                {/* <strong>Speaker: </strong> */}
                                <span>{speaker.title}</span>
                                {speaker.institution && (
                                    <span>
                                        , <em>{speaker.institution}</em>
                                    </span>
                                )}
                            </p>
                        ))}
                    </div>
                )}
            </div>
            <a class="image-wrapper" href={`/media${video.data.slug}`}>
                <img
                    src={`https://img.youtube.com/vi/${ytID}/mqdefault.jpg`}
                    alt={video.data.title}
                    width={300}
                    height={168}
                    loading="lazy"
                    decoding="async"
                />
            </a>
        </article>
    );
}
