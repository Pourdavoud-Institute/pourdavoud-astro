import { sanityClient } from 'sanity:client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImage } from '@lib/utils/types';

const builder = imageUrlBuilder(sanityClient);

/** Generate a URL from Sanity's image builder string.
 * @param source - Sanity image record (with asset, crop, hotspot)
 * @returns Image URL Builder
 */
export const urlForImage = (source: SanityImage) => builder.image(source);
