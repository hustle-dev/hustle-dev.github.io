import React from 'react';
import Logo from '@images/logo.svg';
import Rss from '@images/rss.svg';
import DarkMode from '@images/darkmode.svg';
import * as styles from './Header.module.css';
import { Link } from 'gatsby';

export const Header = () => {
  // TODO: 다크모드일때, 아닐때 icon 색상
  const color = '#000000'; // #ffffff

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.headingLink}>
        <h1 className={styles.headingWrapper}>
          <Logo />
          <span className={styles.heading}>Hustle-devlog</span>
        </h1>
      </Link>
      <div className={styles.headerButtons}>
        {/* TODO: RSS 피드 달면 링크 수정하기 */}
        <Link to="/">
          <Rss className={styles.icon} />
        </Link>
        <button className={styles.iconButton}>
          <DarkMode className={styles.icon} />
        </button>
      </div>
    </header>
  );
};
