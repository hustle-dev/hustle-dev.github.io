import { TYPO } from '@styles';
import React from 'react';
import * as styles from './Footer.module.css';

export const Footer = () => {
  return (
    <footer style={TYPO.D1} className={styles.footer}>
      <span className={styles.copyRight}>Copyright © 2023. hustle-dev. All rights reserved.</span>
      <p className={styles.shoutOut}>Designed by Julie</p>
    </footer>
  );
};
