import { useComputed, useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';

type Props = {
    title: string;
};

export default function ShareLinks({ title }: Props) {
    const webShareSupported = useSignal(false);
    const webShareMessage = useSignal('');
    const clipboardSupported = useSignal(false);
    const clipboardMessage = useSignal('');

    useEffect(() => {
        if (window.navigator.share != undefined) {
            webShareSupported.value = true;
        }

        if (window.navigator.clipboard != undefined) {
            clipboardSupported.value = true;
        }
    }, []);

    function handleShare() {
        if (webShareSupported.value == true) {
            const url = window.location.href;
            window.navigator
                .share({
                    title,
                    url,
                })
                .then(() => {
                    console.log('sharing', url);
                    webShareMessage.value = 'Link shared!';
                    setTimeout(() => {
                        webShareMessage.value = '';
                    }, 3000);
                })
                .catch((err) => console.error('Error sharing', err));
        }
    }

    function handleCopy() {
        // console.log('copy');
        if (clipboardSupported.value == true) {
            const url = window.location.href;
            window.navigator.clipboard
                .writeText(url)
                .then(() => {
                    console.log('copying', url);
                    clipboardMessage.value = 'Link copied!';
                    setTimeout(() => {
                        clipboardMessage.value = '';
                    }, 3000);
                })
                .catch((err) => console.error('Error copying', err));
        }
    }

    const displayWebShareMessage = useComputed(() => {
        if (webShareMessage.value) {
            return '';
        } else {
            return `display: none;`;
        }
    });

    const displayClipboardMessage = useComputed(() => {
        if (clipboardMessage.value) {
            return '';
        } else {
            return `display: none;`;
        }
    });

    return (
        <div
            class="share-links | flow"
            id="share"
            data-tempo="vivace"
            data-pagefind-ignore="all"
        >
            <div class="small-title">Share This Page</div>
            <div class="buttons | cluster">
                {webShareSupported.value == true && (
                    <div class="relative">
                        <button
                            class="button-link with-icon"
                            data-style="primary-ghost"
                            onClick={handleShare}
                            type="button"
                        >
                            <svg
                                aria-hidden="true"
                                class="ucla-icon__link-external"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M19 19H5V5H12V3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V12H19V19ZM14 3V5H17.59L7.76 14.83L9.17 16.24L19 6.41V10H21V3H14Z" />
                            </svg>
                            <span>Share</span>
                        </button>
                        <p
                            class="context-alert"
                            role="alert"
                            aria-live="polite"
                            style={displayWebShareMessage.value}
                        >
                            {webShareMessage.value}
                        </p>
                    </div>
                )}
                {clipboardSupported.value == true && (
                    <div class="relative">
                        <button
                            class="button-link with-icon"
                            data-style="primary-ghost"
                            onClick={handleCopy}
                            type="button"
                        >
                            <svg
                                aria-hidden="true"
                                class="ucla-icon__copy"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M16.5 1H4.5C3.4 1 2.5 1.9 2.5 3V17H4.5V3H16.5V1ZM19.5 5H8.5C7.4 5 6.5 5.9 6.5 7V21C6.5 22.1 7.4 23 8.5 23H19.5C20.6 23 21.5 22.1 21.5 21V7C21.5 5.9 20.6 5 19.5 5ZM19.5 21H8.5V7H19.5V21Z" />
                            </svg>
                            <span>Copy Link</span>
                        </button>
                        <p
                            class="context-alert"
                            role="alert"
                            aria-live="polite"
                            style={displayClipboardMessage.value}
                        >
                            {clipboardMessage.value}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
