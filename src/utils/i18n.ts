import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en } from "@/src/utils/translations/en";

i18next
    .use(initReactI18next)  // important for react!
    .init({
        lng: 'en',
        fallbackLng: 'en',
        resources: {
            en: {
                translation: en
            }
        }
    });

export default i18next;
