import type { RichText } from '@content/schemaFragments/pageModules';

/** Helper function to extract an array of headings from Sanity portable text/rich text section
 * @param module Sanity richText module with portable text blocks
 * @returns Array of string headings within rich text component
 */
export const getRichTextHeadings = (module: RichText): string[] => {
    const headings: string[] = [];

    if (module.blocks && module.blocks.length > 0) {
        for (let i = 0; i < module.blocks?.length; i++) {
            const block = module.blocks[i];

            if (block.style == 'h2') {
                const text = block.children[0].text;

                if (text) {
                    headings.push(text);
                }
            }
        }
    }

    return headings;
};
