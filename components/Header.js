import { useState, useEffect, useRef } from 'react';
import styles from '../styles/Home.module.css';

const Header = ({ currentLanguage, onLanguageChange, translations }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: 'ru', flag: '🇷🇺', name: 'Русский', display: '🇷🇺 RU' },
    { code: 'en', flag: '🇺🇸', name: 'English', display: '🇺🇸 EN' },
    // { code: 'es', flag: '🇪🇸', name: 'Español', display: '🇪🇸 ES' }
  ];

  const currentLang = languages.find(lang => lang.code === currentLanguage);

  // Закрытие выпадающего меню при клике вне его
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

  const handleLanguageChange = (langCode, display) => {
    onLanguageChange(langCode);
    setIsDropdownOpen(false);
  };

  const handleLogin = () => {
    alert(translations[currentLanguage].login);
  };

  const handleRegister = () => {
    alert(translations[currentLanguage].register);
  };

  return (
    <header className={styles.header}>
      <a href="#" className={styles.logo}>
        Logit
      </a>
      
      <div className={styles.navControls}>
        {/* Селектор языка */}
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
                onClick={() => handleLanguageChange(lang.code, lang.display)}
              >
                {lang.flag} {lang.name}
              </div>
            ))}
          </div>
        </div>

        {/* Кнопки авторизации */}
        <div className={styles.authButtons}>
          <button 
            className={`${styles.btn} ${styles.btnSecondary}`}
            onClick={handleLogin}
          >
            {translations[currentLanguage].login}
          </button>
          <button 
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={handleRegister}
          >
            {translations[currentLanguage].register}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;