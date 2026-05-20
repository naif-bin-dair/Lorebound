import { useLanguage } from '../i18n/useLanguage';
import './LanguageToggle.css';

export default function LanguageToggle() {
  const { language, t, toggleLanguage } = useLanguage();

  return (
    <button
      type="button"
      className="lang-toggle"
      onClick={toggleLanguage}
      aria-label={language === 'en' ? 'Switch to Arabic' : 'Switch to English'}
    >
      {t.langToggleLabel}
    </button>
  );
}
