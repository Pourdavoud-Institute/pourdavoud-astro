/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

export default getViteConfig({
    test: {
        root: '.',
        dir: 'src/test',
    },
});
