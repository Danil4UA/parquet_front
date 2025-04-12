export const SUPPORTED_LOCALES = ['en', 'ru', 'he'];

export interface LanguageOption {
  value: string;
  label: string;
  abbr: string;
}

export const languageOptions: LanguageOption[] = [
  { value: "en", label: "English", abbr: "EN" },
  { value: "ru", label: "Русский", abbr: "RU" },
  { value: "he", label: "עברית", abbr: "HE" }
];

export const getLocaleFromPath = (pathname: string): string => {
  const localeFromPath = pathname.split("/")[1];
  return SUPPORTED_LOCALES.includes(localeFromPath) ? localeFromPath : "en";
};