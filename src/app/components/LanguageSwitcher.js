// // components/LanguageSwitcher.js
// import { useTranslation } from 'react-i18next';

// const LanguageSwitcher = () => {
//   const { i18n } = useTranslation();

//   const changeLanguage = (lang) => {
//     i18n.changeLanguage(lang);
//   };

//   return (
//     <div>
//       <button onClick={() => changeLanguage('en')}>English</button>
//       <button onClick={() => changeLanguage('bn')}>বাংলা</button>
//     </div>
//   );
// };

// export default LanguageSwitcher;

"use client"

// import { useRouter } from 'next/navigation';

// const LanguageSwitcher = () => {
//   const router = useRouter();

//   const changeLanguage = (lang) => {
//     router.push(router.asPath, undefined, { locale: lang });
//   };

//   return (
//     <div>
//       <button onClick={() => changeLanguage('en')}>English</button>
//       <button onClick={() => changeLanguage('bn')}>বাংলা</button>
//     </div>
//   );
// };

// export default LanguageSwitcher;

// import { useTranslation } from 'next-i18next';

// const LanguageSwitcher = () => {
//   const { i18n } = useTranslation();

//   const changeLanguage = (lng) => {
//     i18n.changeLanguage(lng);
//   };

//   return (
//     <div>
//       <button onClick={() => changeLanguage('en')}>English</button>
//       <button onClick={() => changeLanguage('bn')}>বাংলা</button>
//     </div>
//   );
// };

// export default LanguageSwitcher;

// components/LanguageSwitcher.js
import { useRouter } from 'next/router';

const LanguageSwitcher = () => {
  const router = useRouter();

  const changeLanguage = (lang) => {
    router.push(router.asPath, router.asPath, { locale: lang });
  };

  return (
    <div>
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('bn')}>Bengali</button>
    </div>
  );
};

export default LanguageSwitcher;


