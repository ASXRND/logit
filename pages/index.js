import { useState } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import StarField from '../components/StarField';
import styles from '../styles/Home.module.css';

// Переводы
const translations = {
  ru: {
    login: 'Вход',
    register: 'Регистрация',
    mainTitle: 'Добро пожаловать в будущее',
    mainSubtitle: 'Создавайте удивительные проекты с современными технологиями. Откройте для себя новые возможности веб-разработки.',
    getStarted: 'Начать',
    learnMore: 'Узнать больше'
  },
  en: {
    login: 'Login',
    register: 'Sign Up',
    mainTitle: 'Welcome to the Future',
    mainSubtitle: 'Create amazing projects with modern technologies. Discover new possibilities in web development.',
    getStarted: 'Get Started',
    learnMore: 'Learn More'
  },
  es: {
    login: 'Iniciar sesión',
    register: 'Registrarse',
    mainTitle: 'Bienvenido al Futuro',
    mainSubtitle: 'Crea proyectos increíbles con tecnologías modernas. Descubre nuevas posibilidades en el desarrollo web.',
    getStarted: 'Comenzar',
    learnMore: 'Saber más'
  }
};

export default function Home() {
  const [currentLanguage, setCurrentLanguage] = useState('ru');

  const handleLanguageChange = (newLanguage) => {
    setCurrentLanguage(newLanguage);
  };

  const handleGetStarted = () => {
    alert(translations[currentLanguage].getStarted);
  };

  const handleLearnMore = () => {
    alert(translations[currentLanguage].learnMore);
  };

  const currentTranslations = translations[currentLanguage];

  return (
    <>
      <Head>
        <title>Logit - Главная страница</title>
        <meta name="description" content="Современная веб-разработка с Next.js" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Звездное небо */}
      <StarField />

      {/* Хедер */}
      <Header 
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
        translations={translations}
      />

      {/* Основной контент */}
      <main className={styles.mainContent}>
        <h1 className={styles.heroTitle}>
          {currentTranslations.mainTitle}
        </h1>
        <p className={styles.heroSubtitle}>
          {currentTranslations.mainSubtitle}
        </p>
        <div className={styles.heroButtons}>
          <button 
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={handleGetStarted}
          >
            {currentTranslations.getStarted}
          </button>
          <button 
            className={`${styles.btn} ${styles.btnSecondary}`}
            onClick={handleLearnMore}
          >
            {currentTranslations.learnMore}
          </button>
        </div>
      </main>
    </>
  );
}