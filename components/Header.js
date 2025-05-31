import { useState, useEffect, useRef } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import styles from '../styles/Home.module.css';

const Header = ({ currentLanguage, onLanguageChange, translations }) => {
  const { data: session } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: 'ru', flag: '🇷🇺', name: 'Русский', display: '🇷🇺 RU' },
    { code: 'en', flag: '🇺🇸', name: 'English', display: '🇺🇸 EN' },
    // { code: 'es', flag: '🇪🇸', name: 'Español', display: '🇪🇸 ES' }
  ];

  const currentLang = languages.find(lang => lang.code === currentLanguage);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (langCode) => {
    onLanguageChange(langCode);
    setIsDropdownOpen(false);
  };

  const t = translations[currentLanguage];

  return (
    <header className={styles.header}>
      <a href="#" className={styles.logo}>
        Logit
      </a>

      <div className={styles.navControls}>
        {/* Языковой переключатель */}
        <div className={styles.languageSelector} ref={dropdownRef}>
          <div
            className={styles.languageBtn}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span>{currentLang?.display}</span>
            <span>{isDropdownOpen ? '▲' : '▼'}</span>
          </div>
          <div className={`${styles.languageDropdown} ${isDropdownOpen ? styles.active : ''}`}>
            {languages.map((lang) => (
              <div
                key={lang.code}
                className={styles.languageOption}
                onClick={() => handleLanguageChange(lang.code)}
              >
                {lang.flag} {lang.name}
              </div>
            ))}
          </div>
        </div>

        {/* Авторизация */}
        <div className={styles.authButtons}>
          {session ? (
            <>
              <span className={styles.userName}>{session.user.name}</span>
              <button
                className={`${styles.btn} ${styles.btnSecondary}`}
                onClick={() => signOut()}
              >
                {t.logout || 'Выйти'}
              </button>
            </>
          ) : (
            <button
              className={`${styles.btn} ${styles.btnPrimary}`}
              onClick={() => signIn('google')}
            >
              {t.loginWithGoogle || 'Войти с Google'}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
