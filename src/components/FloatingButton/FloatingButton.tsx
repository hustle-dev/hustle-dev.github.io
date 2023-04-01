import React, { useEffect, useState } from 'react';
import Arrow from '@images/arrow.svg';
import * as styles from './FloatingButton.module.css';

const SCROLL_THRESHOLD = 200;

export const FloatingButton = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    setIsVisible(currentScrollY > SCROLL_THRESHOLD);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <button className={`${styles.floatingButton} ${isVisible ? styles.visible : ''}`} onClick={scrollToTop}>
      <Arrow className={styles.icon} />
    </button>
  );
};
