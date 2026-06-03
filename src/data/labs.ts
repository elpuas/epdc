import { getCollection, type CollectionEntry } from 'astro:content';
import type { Language } from '../i18n/utils';

export type LabsEntry = CollectionEntry<'labs'>;

type LabsIndexCopy = {
  pageTitle: string;
  pageDescription: string;
  heading: string;
  intro: string;
  emptyMessage: string;
};

export const labsIndexCopy: Record<Language, LabsIndexCopy> = {
  en: {
    pageTitle: 'EPDC Labs | Internal Tools, AI Workflows, and Product Systems',
    pageDescription:
      'EPDC Labs is where ElPuas Digital Crafts documents internal tools, AI workflows, plugins, and reusable engineering systems.',
    heading: 'EPDC Labs',
    intro:
      'A focused archive of internal tools, product systems, AI workflows, plugins, and reusable engineering experiments built at ElPuas Digital Crafts. Each entry is practical, technical, and grounded in implementation.',
    emptyMessage: 'No lab entries are available yet.',
  },
  es: {
    pageTitle: 'EPDC Labs | Herramientas internas, flujos IA y sistemas de producto',
    pageDescription:
      'EPDC Labs reúne herramientas internas, flujos de IA, plugins y sistemas reutilizables creados por ElPuas Digital Crafts.',
    heading: 'EPDC Labs',
    intro:
      'Un archivo técnico de herramientas internas, sistemas de producto, flujos con IA, plugins y experimentos reutilizables creados en ElPuas Digital Crafts. Cada entrada parte de implementación real, no de marketing.',
    emptyMessage: 'Todavía no hay entradas en EPDC Labs.',
  },
  it: {
    pageTitle: 'EPDC Labs | Strumenti interni, workflow AI e sistemi di prodotto',
    pageDescription:
      'EPDC Labs raccoglie strumenti interni, workflow AI, plugin e sistemi riutilizzabili creati da ElPuas Digital Crafts.',
    heading: 'EPDC Labs',
    intro:
      'Un archivio tecnico di strumenti interni, sistemi di prodotto, workflow con IA, plugin ed esperimenti riutilizzabili creati in ElPuas Digital Crafts. Ogni voce nasce da implementazioni reali.',
    emptyMessage: 'Non ci sono ancora voci disponibili in EPDC Labs.',
  },
};

export async function getLabsByLanguage(lang: Language) {
  const labs = await getCollection('labs', ({ data }) => data.lang === lang);

  return labs.sort((a, b) => {
    const featuredDelta = Number(b.data.featured) - Number(a.data.featured);

    if (featuredDelta !== 0) {
      return featuredDelta;
    }

    return b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf();
  });
}

export function getLabPublicSlug(lab: LabsEntry) {
  return lab.data.publicSlug ?? lab.id.replace(/\.(en|es|it)$/, '');
}

export async function getLabStaticPaths(lang: Language) {
  const labs = await getLabsByLanguage(lang);

  return labs.map((lab) => ({
    params: { slug: getLabPublicSlug(lab) },
    props: { lab },
  }));
}
