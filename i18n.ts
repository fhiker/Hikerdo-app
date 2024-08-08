import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from '@/locales/en/en.json';
import es from '@/locales/es/es.json';
import fr from '@/locales/fr/fr.json';
import jp from '@/locales/jp/jp.json';
import cz from '@/locales/cz/cz.json';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: localStorage.getItem('language') ?? 'en',
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: en,
      },
      es: {
        translation: es,
      },
      fr: {
        translation: fr,
      },
      jp: {
        translation: jp,
      },
      cz: {
        translation: cz,
      },
    },
  });

export default i18n;
