import React from 'react'
import * as styles from './ProfileCard.module.css'
import { StaticImage } from 'gatsby-plugin-image'
import * as typo from '@/styles/typography.module.css'
import Mail from '@/images/mail.svg'
import Facebook from '@/images/facebook.svg'
import Linkedin from '@/images/linkedin.svg'
import Github from '@/images/github.svg'
import clsx from 'clsx'

type ProfileCardProps = {
  pathname?: string
}

export const ProfileCard = ({ pathname }: ProfileCardProps) => {
  const isPost = pathname?.includes('/posts/')

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
        <div>
          <h1 className={clsx(styles.name, typo.D1)}>Hustle-dev</h1>
          <p style={{ marginTop: '0px', height: '46px' }} className={clsx(styles.description, typo.B3)}>
            It is possible for ordinary people to choose to be extraordinary.
          </p>
          <div className={styles.iconWrapper}>
            <a href="mailto:dlwoabsdk@gmail.com" target="_blank" className={styles.profileIcon} rel="noreferrer">
              <Mail />
            </a>
            <a
              href="https://www.facebook.com/jeongminiminimini/"
              target="_blank"
              className={styles.profileIcon}
              rel="noreferrer"
            >
              <Facebook />
            </a>
            <a
              href="https://www.linkedin.com/in/jeongmin-lee-5ab898202/"
              target="_blank"
              className={styles.profileIcon}
              rel="noreferrer"
            >
              <Linkedin />
            </a>
            <a href="https://github.com/hustle-dev" target="_blank" className={styles.profileIcon} rel="noreferrer">
              <Github />
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.card}>
      <h1 className={clsx(styles.name, typo.D1)}>Hustle-devlog</h1>
      <p className={clsx(styles.description, typo.B3)}>
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
        <a href="mailto:dlwoabsdk@gmail.com" target="_blank" className={styles.profileIcon} rel="noreferrer">
          <Mail />
        </a>
        <a
          href="https://www.facebook.com/jeongminiminimini/"
          target="_blank"
          className={styles.profileIcon}
          rel="noreferrer"
        >
          <Facebook />
        </a>
        <a
          href="https://www.linkedin.com/in/jeongmin-lee-5ab898202/"
          target="_blank"
          className={styles.profileIcon}
          rel="noreferrer"
        >
          <Linkedin />
        </a>
        <a href="https://github.com/hustle-dev" target="_blank" className={styles.profileIcon} rel="noreferrer">
          <Github />
        </a>
      </div>
    </div>
  )
}
