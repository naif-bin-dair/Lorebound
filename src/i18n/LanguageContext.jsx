import { useEffect, useState } from 'react';
import {
  translations,
  getDeviceLanguage,
  getStoredLanguage,
  storeLanguage,
} from './translations';
import { LanguageContext } from './languageContext';

export default function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return getStoredLanguage() ?? getDeviceLanguage();
  });

  const t = translations[language];

  const toggleLanguage = () => {
    setLanguage((prev) => {
      const next = prev === 'en' ? 'ar' : 'en';
      storeLanguage(next);
      return next;
    });
  };

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.title = t.appTitle;
  }, [language, t.appTitle]);

  return (
    <LanguageContext.Provider value={{ language, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}
