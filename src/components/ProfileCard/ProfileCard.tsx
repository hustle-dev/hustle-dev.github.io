import React from 'react';
import * as styles from './ProfileCard.module.css';
import { StaticImage } from 'gatsby-plugin-image';
import { TYPO } from '@styles';
import Mail from '@images/mail.svg';
import Facebook from '@images/facebook.svg';
import Linkedin from '@images/linkedin.svg';
import Github from '@images/github.svg';

type ProfileCardProps = {
  pathname?: string;
};

export const ProfileCard = ({ pathname }: ProfileCardProps) => {
  const isPost = pathname?.includes('/posts/');

  if (isPost) {
    return (
      <div className={styles.wrapper}>
        <StaticImage
          src="../../images/elon.jpeg"
          alt="일론 머스크"
          objectFit="fill"
          className={styles.postProfileImage}
          width={100}
          height={100}
        ></StaticImage>
        <div className={styles.infoContainer}>
          <h1 style={TYPO.D1} className={styles.name}>
            Hustle-dev
          </h1>
          <p style={{ marginTop: '0px', height: '46px', ...TYPO.B3 }} className={styles.description}>
            It is possible for ordinary people to choose to be extraordinary.
          </p>
          <div className={styles.iconWrapper}>
            <a href="mailto:dlwoabsdk@gmail.com" target="_blank" className={styles.profileIcon}>
              <Mail />
            </a>
            <a href="https://www.facebook.com/jeongminiminimini/" target="_blank" className={styles.profileIcon}>
              <Facebook />
            </a>
            <a
              href="https://www.linkedin.com/in/jeongmin-lee-5ab898202/"
              target="_blank"
              className={styles.profileIcon}
            >
              <Linkedin />
            </a>
            <a href="https://github.com/hustle-dev" target="_blank" className={styles.profileIcon}>
              <Github />
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <h1 style={TYPO.D1} className={styles.name}>
        Hustle-devlog
      </h1>
      <p style={TYPO.B3} className={styles.description}>
        It is possible for ordinary people to choose to be extraordinary.
      </p>
      <div className={styles.info}>
        <StaticImage
          src="../../images/elon.jpeg"
          alt="일론 머스크"
          className={styles.profileImage}
          width={100}
          height={100}
        ></StaticImage>
        <a href="mailto:dlwoabsdk@gmail.com" target="_blank" className={styles.profileIcon}>
          <Mail />
        </a>
        <a href="https://www.facebook.com/jeongminiminimini/" target="_blank" className={styles.profileIcon}>
          <Facebook />
        </a>
        <a href="https://www.linkedin.com/in/jeongmin-lee-5ab898202/" target="_blank" className={styles.profileIcon}>
          <Linkedin />
        </a>
        <a href="https://github.com/hustle-dev" target="_blank" className={styles.profileIcon}>
          <Github />
        </a>
      </div>
    </div>
  );
};
