import { Link } from 'react-router-dom';
import './LandingPage.css';
import EmojiBackground from '../components/EmojiBackground';
import { useLanguage } from '../i18n/useLanguage';
import LanguageToggle from '../components/LanguageToggle';

export default function LandingPage() {
  const { t } = useLanguage();

  return (
    <div className="landing">
      <LanguageToggle />
      <EmojiBackground />
      <main className="landing-content">
        <span className="landing-icon" aria-hidden="true">📖</span>
        <h1 className="landing-title">{t.appTitle}</h1>
        <p className="landing-tagline">{t.landing.tagline}</p>
        <ul className="landing-features">
          <li>{t.landing.feature1}</li>
          <li>{t.landing.feature2}</li>
          <li>{t.landing.feature3}</li>
        </ul>
        <Link to="/play" className="landing-cta">
          {t.landing.startAdventure}
        </Link>
      </main>
    </div>
  );
}
