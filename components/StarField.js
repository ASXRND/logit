import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';

const StarField = () => {
  const [stars, setStars] = useState([]);
  const [shootingStars, setShootingStars] = useState([]);

  useEffect(() => {
    // Создаем обычные звезды
    const generateStars = () => {
      const newStars = [];
      
      for (let i = 0; i < 100; i++) {
        const star = {
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() < 0.5 ? 'small' : Math.random() < 0.8 ? 'medium' : 'large',
          animationDelay: Math.random() * 3,
        };
        newStars.push(star);
      }
      
      setStars(newStars);
    };

    // Создаем падающие звезды
    const generateShootingStars = () => {
      const newShootingStars = [];
      
      for (let i = 0; i < 5; i++) {
        const shootingStar = {
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 50,
          animationDelay: Math.random() * 5,
        };
        newShootingStars.push(shootingStar);
      }
      
      setShootingStars(newShootingStars);
    };

    generateStars();
    generateShootingStars();

    // Пересоздаем падающие звезды каждые 8 секунд
    const interval = setInterval(generateShootingStars, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.starsContainer}>
      {/* Обычные звезды */}
      {stars.map((star) => (
        <div
          key={star.id}
          className={`${styles.star} ${styles[star.size]}`}
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            animationDelay: `${star.animationDelay}s`,
          }}
        />
      ))}
      
      {/* Падающие звезды */}
      {shootingStars.map((star) => (
        <div
          key={`shooting-${star.id}`}
          className={styles.shootingStar}
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            animationDelay: `${star.animationDelay}s`,
          }}
        />
      ))}
    </div>
  );
};

export default StarField;