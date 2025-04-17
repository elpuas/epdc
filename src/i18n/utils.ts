export type Language = 'en' | 'es' | 'it';

export const SUPPORTED_LANGUAGES = ['en', 'es', 'it'] as const;
export const DEFAULT_LANGUAGE: Language = 'en';

type Translations = {
  [key in Language]: {
    nav: {
      about: string;
      services: string;
      crafted: string;
      blog: string;
      contact: string;
    };
    common: {
      readMore: string;
      loading: string;
      error: string;
      welcome: string;
      welcomeMessage: string;
    };
    language: {
      en: string;
      es: string;
      it: string;
      switch: string;
    };
  };
};

const translations: Translations = {
  en: (await import('./translations/en.json')).default,
  es: (await import('./translations/es.json')).default,
  it: (await import('./translations/it.json')).default,
};

export type TranslationKey = keyof typeof translations.en;

export function t(key: string, lang: Language = DEFAULT_LANGUAGE): string {
  const keys = key.split('.');
  let value: any = translations[lang];

  for (const k of keys) {
    if (value === undefined) return key;
    value = value[k];
  }

  return value || translations[DEFAULT_LANGUAGE][key as keyof typeof translations.en] || key;
}

export function getBrowserLanguage(): Language {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  
  const browserLang = navigator.language.split('-')[0];
  return SUPPORTED_LANGUAGES.includes(browserLang as Language) 
    ? browserLang as Language 
    : DEFAULT_LANGUAGE;
}

export function persistLanguage(lang: Language): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('preferredLanguage', lang);
}

export function getPersistedLanguage(): Language | null {
  if (typeof window === 'undefined') return null;
  const lang = localStorage.getItem('preferredLanguage');
  return SUPPORTED_LANGUAGES.includes(lang as Language) ? lang as Language : null;
} 