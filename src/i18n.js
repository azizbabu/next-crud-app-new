// // i18n.js
// import { initReactI18next } from 'react-i18next';
// import i18next from 'i18next';

// i18next
//   .use(initReactI18next)
//   .init({
//     fallbackLng: 'en',
//     lng: 'en',
//     resources: {
//       en: {
//         common: require('./locales/en/common.json'),
//       },
//       bn: {
//         common: require('./locales/bn/common.json'),
//       },
//     },
//     interpolation: {
//       escapeValue: false,
//     },
//   });

// export default i18next;

// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    fallbackLng: 'en', // fallback language
    lng: 'en', // default language
    debug: true, // set to false in production
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    resources: {
      en: {
        common: require('../public/locales/en/common.json'),
      },
      bn: {
        common: require('../public/locales/bn/common.json'),
      },
    },
  });

export default i18n;

