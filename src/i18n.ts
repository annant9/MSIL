import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEN from './assets/i18n/en.json';

i18n.use(initReactI18next).init({
    resources: {
        en: { translation: translationEN },
    },
    fallbackLng: 'en',
    lng: 'en',
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;