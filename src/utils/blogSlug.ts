import type { CollectionEntry } from 'astro:content';

type BlogEntry = CollectionEntry<'blog'>;

export function getBlogEntrySlug(entry: Pick<BlogEntry, 'id' | 'slug' | 'data'>): string {
  const idWithoutExtension = entry.id.replace(/\.(md|mdx)$/i, '');
  const languageSuffix = `.${entry.data.lang}`;

  if (idWithoutExtension.endsWith(languageSuffix)) {
    return idWithoutExtension.slice(0, -languageSuffix.length);
  }

  return entry.slug;
}
