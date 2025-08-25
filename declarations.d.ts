declare global {
    namespace preact.JSX {
        // type Element = HTMLElement;
        interface IntrinsicElements {
            'sl-select': any;
            'sl-option': any;
        }
    }
}

export {};
