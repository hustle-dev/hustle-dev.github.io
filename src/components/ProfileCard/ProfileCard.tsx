import React from 'react';
import * as styles from './ProfileCard.module.css';
import { StaticImage } from 'gatsby-plugin-image';
import { TYPO } from '@styles';
import Mail from '@images/mail.svg';
import Facebook from '@images/facebook.svg';
import Linkedin from '@images/linkedin.svg';
import Github from '@images/github.svg';

export const ProfileCard = () => {
  return (
    <div className={styles.card}>
      <h1 className={styles.name}>Hustle-devlog</h1>
      <p style={TYPO.B5} className={styles.description}>
        It is possible for ordianry people to choose to be extraordinary.
      </p>
      <div className={styles.info}>
        <StaticImage
          src="../../images/elon.jpeg"
          alt="일론 머스크"
          className={styles.profileImage}
          width={100}
          height={100}
        ></StaticImage>
        <a href="mailto:dlwoabsdk@gmail.com">
          <Mail />
        </a>
        <a href="https://www.linkedin.com/in/jeongmin-lee-5ab898202/">
          <Linkedin />
        </a>
        <a href="https://www.facebook.com/jeongminiminimini/">
          <Facebook />
        </a>
        <a href="https://github.com/hustle-dev">
          <Github />
        </a>
      </div>
    </div>
  );
};
