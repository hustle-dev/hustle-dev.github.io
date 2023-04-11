import React, { useEffect, useState } from 'react';
import Logo from '@images/logo.svg';
import Rss from '@images/rss.svg';
import DarkMode from '@images/darkmode.svg';
import * as styles from './Header.module.css';
import { Link } from 'gatsby';
import { optimizedScroll } from '@utils';
import { useTheme } from '@contexts';

type HeaderProps = {
  pathname: string;
};

export const Header = ({ pathname }: HeaderProps) => {
  const { toggleDarkMode } = useTheme();
  const [progressWidth, setProgressWidth] = useState<number>(0);

  const updateProgress = () => {
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPosition = window.scrollY;
    const scrollProgress = (scrollPosition / scrollHeight) * 100;
    setProgressWidth(scrollProgress);
  };

  useEffect(() => {
    if (pathname === '/') return;

    window.addEventListener('scroll', optimizedScroll(updateProgress));

    return () => {
      window.removeEventListener('scroll', optimizedScroll(updateProgress));
    };
  }, [pathname]);

  const isMainPage = pathname === '/';

  return (
    <header className={`${styles.header} ${!isMainPage ? styles.fixed : ''}`}>
      <div className={styles.wrapper}>
        <Link to="/" className={styles.headingLink}>
          <h1 className={styles.headingWrapper}>
            <Logo />
            <span className={styles.heading}>Hustle-devlog</span>
          </h1>
        </Link>
        <div className={styles.headerButtons}>
          <a href="/rss.xml" rel="noopener noreferrer">
            <Rss className={styles.icon} />
          </a>
          <button className={styles.iconButton} onClick={toggleDarkMode} tabIndex={0}>
            <DarkMode className={styles.icon} />
          </button>
        </div>
      </div>
      {pathname !== '/' && <div className={styles.progressBar} style={{ width: `${progressWidth}%` }} />}
    </header>
  );
};
